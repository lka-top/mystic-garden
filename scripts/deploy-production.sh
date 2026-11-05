#!/usr/bin/env bash

set -Eeuo pipefail

: "${DEPLOY_SHA:?DEPLOY_SHA is required}"
: "${APP_IMAGE:?APP_IMAGE is required}"
: "${BACKEND_IMAGE:?BACKEND_IMAGE is required}"
: "${PROJECT_DIR:?PROJECT_DIR is required}"
: "${RELEASE_DIR:?RELEASE_DIR is required}"
: "${PRODUCTION_URL:?PRODUCTION_URL is required}"

if [[ ! "${DEPLOY_SHA}" =~ ^[0-9a-f]{40}$ ]]; then
  echo "DEPLOY_SHA must be a full 40-character Git SHA" >&2
  exit 1
fi
if [[ "${APP_IMAGE}" != *":${DEPLOY_SHA}" || "${BACKEND_IMAGE}" != *":${DEPLOY_SHA}" ]]; then
  echo "Production images must use the exact DEPLOY_SHA tag" >&2
  exit 1
fi
if [[ ! "${PROJECT_DIR}" =~ ^/[A-Za-z0-9._/-]+$ || ! "${RELEASE_DIR}" =~ ^/[A-Za-z0-9._/-]+$ ]]; then
  echo "Deployment directories must be safe absolute paths" >&2
  exit 1
fi

readonly STATE_DIR="${PROJECT_DIR}/.deploy"
readonly LOCK_FILE="${STATE_DIR}/deploy.lock"
readonly ENV_FILE="${PROJECT_DIR}/.env"
readonly COMPOSE_FILE="${PROJECT_DIR}/docker-compose.yml"
readonly NGINX_CONFIG="${PROJECT_DIR}/nginx/conf.d/app.conf"
readonly RELEASE_COMPOSE="${RELEASE_DIR}/docker-compose.yml"
readonly RELEASE_NGINX_CONFIG="${RELEASE_DIR}/nginx/conf.d/app.conf"
readonly RELEASE_ENV="${PROJECT_DIR}/.release.env"
readonly BACKUP_DIR="/data/backups/luokai-blog/pre-deploy"
readonly CONFIG_BACKUP_DIR="${STATE_DIR}/config-backup-${DEPLOY_SHA}"

for command_name in docker gzip flock install; do
  if ! command -v "${command_name}" >/dev/null 2>&1; then
    echo "Required command is unavailable: ${command_name}" >&2
    exit 1
  fi
done

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Production environment file is missing: ${ENV_FILE}" >&2
  exit 1
fi
if [[ ! -f "${RELEASE_COMPOSE}" || ! -f "${RELEASE_NGINX_CONFIG}" ]]; then
  echo "Release archive is incomplete" >&2
  exit 1
fi

mkdir -p "${STATE_DIR}" "${BACKUP_DIR}" "${CONFIG_BACKUP_DIR}" "${PROJECT_DIR}/nginx/conf.d"
exec 9>"${LOCK_FILE}"
if ! flock -n 9; then
  echo "Another production deployment is already running" >&2
  exit 1
fi

ACTIVE_APP_IMAGE="${APP_IMAGE}"
ACTIVE_BACKEND_IMAGE="${BACKEND_IMAGE}"
OLD_APP_IMAGE=""
OLD_BACKEND_IMAGE=""
ROLLBACK_ARMED=false
DEPLOY_SUCCEEDED=false

run_compose() {
  APP_IMAGE="${ACTIVE_APP_IMAGE}" \
    BACKEND_IMAGE="${ACTIVE_BACKEND_IMAGE}" \
    docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" "$@"
}

container_image() {
  docker inspect --format '{{.Config.Image}}' "$1" 2>/dev/null || true
}

wait_for_healthy() {
  local container_name="$1"
  local timeout_seconds="$2"
  local started_at
  local current_time
  local health_status

  started_at="$(date +%s)"
  while true; do
    health_status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{if .State.Running}}running{{else}}stopped{{end}}{{end}}' "${container_name}" 2>/dev/null || true)"
    case "${health_status}" in
      healthy|running)
        echo "${container_name} is ${health_status}"
        return 0
        ;;
      unhealthy|stopped)
        echo "${container_name} entered state: ${health_status}" >&2
        return 1
        ;;
    esac

    current_time="$(date +%s)"
    if (( current_time - started_at >= timeout_seconds )); then
      echo "Timed out waiting for ${container_name}; last state: ${health_status:-missing}" >&2
      return 1
    fi
    sleep 5
  done
}

check_public_url() {
  local url="${PRODUCTION_URL%/}/"

  if command -v curl >/dev/null 2>&1; then
    curl --fail --silent --show-error \
      --retry 8 --retry-delay 3 --retry-all-errors \
      --connect-timeout 5 --max-time 20 \
      "${url}" >/dev/null
    return
  fi
  if command -v wget >/dev/null 2>&1; then
    wget -q --timeout=20 --tries=8 -O /dev/null "${url}"
    return
  fi

  echo "Neither curl nor wget is available for the production smoke test" >&2
  return 1
}

write_release_env() {
  local target_file="$1"
  local release_app_image="$2"
  local release_backend_image="$3"
  local release_sha="$4"

  {
    printf 'APP_IMAGE=%s\n' "${release_app_image}"
    printf 'BACKEND_IMAGE=%s\n' "${release_backend_image}"
    printf 'RELEASE_SHA=%s\n' "${release_sha}"
  } > "${target_file}"
  chmod 600 "${target_file}"
}

rollback() {
  local exit_code="$?"

  trap - ERR INT TERM
  if [[ "${DEPLOY_SUCCEEDED}" == true || "${ROLLBACK_ARMED}" != true ]]; then
    exit "${exit_code}"
  fi

  echo "Deployment failed; restoring the previous container images and configuration" >&2

  if [[ -f "${CONFIG_BACKUP_DIR}/docker-compose.yml" ]]; then
    install -m 0644 "${CONFIG_BACKUP_DIR}/docker-compose.yml" "${COMPOSE_FILE}"
  fi
  if [[ -f "${CONFIG_BACKUP_DIR}/app.conf" ]]; then
    install -m 0644 "${CONFIG_BACKUP_DIR}/app.conf" "${NGINX_CONFIG}"
  fi

  ACTIVE_APP_IMAGE="${OLD_APP_IMAGE:-${APP_IMAGE}}"
  ACTIVE_BACKEND_IMAGE="${OLD_BACKEND_IMAGE:-${BACKEND_IMAGE}}"

  if [[ -n "${OLD_BACKEND_IMAGE}" ]]; then
    run_compose up -d --no-deps backend || true
    wait_for_healthy luokai-blog-backend 120 || true
  fi
  if [[ -n "${OLD_APP_IMAGE}" ]]; then
    run_compose up -d --no-deps app || true
    wait_for_healthy luokai-blog-app 120 || true
  fi
  run_compose exec -T nginx nginx -t >/dev/null 2>&1 || true
  run_compose exec -T nginx nginx -s reload >/dev/null 2>&1 || true

  printf '%s\n' "${DEPLOY_SHA}" > "${STATE_DIR}/last-failed-sha"
  echo "Container rollback completed. Database migrations were not reverted." >&2
  exit "${exit_code}"
}

trap rollback ERR INT TERM

OLD_APP_IMAGE="$(container_image luokai-blog-app)"
OLD_BACKEND_IMAGE="$(container_image luokai-blog-backend)"

if [[ -f "${COMPOSE_FILE}" ]]; then
  install -m 0644 "${COMPOSE_FILE}" "${CONFIG_BACKUP_DIR}/docker-compose.yml"
fi
if [[ -f "${NGINX_CONFIG}" ]]; then
  install -m 0644 "${NGINX_CONFIG}" "${CONFIG_BACKUP_DIR}/app.conf"
fi

install -m 0644 "${RELEASE_COMPOSE}" "${COMPOSE_FILE}.candidate"
APP_IMAGE="${APP_IMAGE}" BACKEND_IMAGE="${BACKEND_IMAGE}" \
  docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}.candidate" config -q
mv "${COMPOSE_FILE}.candidate" "${COMPOSE_FILE}"
install -m 0644 "${RELEASE_NGINX_CONFIG}" "${NGINX_CONFIG}"
ROLLBACK_ARMED=true

run_compose config -q
run_compose pull app backend

backup_timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_temp="${BACKUP_DIR}/${backup_timestamp}-${DEPLOY_SHA}.sql.gz.tmp"
backup_file="${backup_temp%.tmp}"

echo "Creating pre-deployment MySQL snapshot: ${backup_file}"
docker exec luokai-mysql sh -c \
  'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" exec mysqldump --single-transaction --quick --default-character-set=utf8mb4 -u root "$MYSQL_DATABASE"' \
  | gzip -c > "${backup_temp}"
test -s "${backup_temp}"
gzip -t "${backup_temp}"
mv "${backup_temp}" "${backup_file}"

echo "Deploying backend image ${BACKEND_IMAGE}"
run_compose up -d --no-deps backend
wait_for_healthy luokai-blog-backend 180

echo "Deploying frontend image ${APP_IMAGE}"
run_compose up -d --no-deps app
wait_for_healthy luokai-blog-app 120

run_compose exec -T nginx nginx -t
run_compose up -d --no-deps nginx
run_compose exec -T nginx nginx -t
run_compose exec -T nginx nginx -s reload

check_public_url

write_release_env "${RELEASE_ENV}.candidate" "${APP_IMAGE}" "${BACKEND_IMAGE}" "${DEPLOY_SHA}"
mv "${RELEASE_ENV}.candidate" "${RELEASE_ENV}"
printf '%s\n' "${DEPLOY_SHA}" > "${STATE_DIR}/current-sha"
run_compose up -d --no-deps --remove-orphans backend app nginx
find "${BACKUP_DIR}" -maxdepth 1 -type f -name '*.sql.gz' -mtime +30 -delete

DEPLOY_SUCCEEDED=true
trap - ERR INT TERM
echo "Production deployment succeeded: ${DEPLOY_SHA}"
