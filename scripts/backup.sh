#!/bin/sh
set -eu

PROJECT_DIR="${PROJECT_DIR:-/data/luokai-blog}"
ENV_FILE="${ENV_FILE:-$PROJECT_DIR/.env}"
UPLOAD_DIR="${UPLOAD_DIR:-$PROJECT_DIR/uploads}"
BACKUP_DIR="${BACKUP_DIR:-/data/backups/luokai-blog}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
MYSQL_CONTAINER="${MYSQL_CONTAINER:-luokai-mysql}"

if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  . "$ENV_FILE"
  set +a
fi

: "${MYSQL_ROOT_PASSWORD:?请配置 MYSQL_ROOT_PASSWORD 或设置 ENV_FILE}"
: "${BACKUP_SSH_TARGET:?请配置 BACKUP_SSH_TARGET，例如 backup@nas.example.com}"
: "${BACKUP_REMOTE_DIR:?请配置 BACKUP_REMOTE_DIR，例如 /volume1/backups/mystic-garden}"
DATABASE_NAME="${MYSQL_DATABASE:-luokai_blog}"

case "$BACKUP_REMOTE_DIR" in
  /*) ;;
  *) echo "BACKUP_REMOTE_DIR 必须是远端绝对路径" >&2; exit 1 ;;
esac
case "$BACKUP_REMOTE_DIR" in
  *[!A-Za-z0-9_./-]*) echo "BACKUP_REMOTE_DIR 仅允许字母、数字、_、-、. 和 /" >&2; exit 1 ;;
esac

DATE="$(date +"%Y%m%d_%H%M%S")"
RUN_DIR="$BACKUP_DIR/$DATE"
DB_FILE="$RUN_DIR/database.sql.gz"
UPLOAD_FILE="$RUN_DIR/uploads.tar.gz"
MANIFEST_FILE="$RUN_DIR/SHA256SUMS"

mkdir -p "$RUN_DIR"

echo "[$DATE] 开始备份数据库..."
docker exec "$MYSQL_CONTAINER" mysqldump --single-transaction --default-character-set=utf8mb4 \
  -u root -p"$MYSQL_ROOT_PASSWORD" "$DATABASE_NAME" | gzip > "$DB_FILE"

if [ ! -d "$UPLOAD_DIR" ]; then
  echo "上传目录不存在：$UPLOAD_DIR" >&2
  exit 1
fi

echo "[$DATE] 开始归档图片..."
tar -czf "$UPLOAD_FILE" -C "$UPLOAD_DIR" .
(cd "$RUN_DIR" && sha256sum database.sql.gz uploads.tar.gz > "$(basename "$MANIFEST_FILE")")

echo "[$DATE] 同步异地备份..."
ssh "$BACKUP_SSH_TARGET" "mkdir -p -- '$BACKUP_REMOTE_DIR/$DATE'"
rsync -az --partial "$RUN_DIR/" "$BACKUP_SSH_TARGET:$BACKUP_REMOTE_DIR/$DATE/"

find "$BACKUP_DIR" -mindepth 1 -maxdepth 1 -type d -mtime +"$BACKUP_RETENTION_DAYS" -exec rm -rf {} +
echo "[$DATE] 备份完成：$BACKUP_SSH_TARGET:$BACKUP_REMOTE_DIR/$DATE"
