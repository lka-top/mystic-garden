#!/bin/bash
BACKUP_DIR="/data/backups/luokai-blog"
DATE=$(date +"%Y%m%d_%H%M%S")
MYSQL_CONTAINER="luokai-mysql"
MYSQL_ROOT_PASS="${MYSQL_ROOT_PASSWORD:-LuokaiSecureRoot2025!}"
DATABASE_NAME="luokai_blog"

mkdir -p "$BACKUP_DIR"

echo "[$DATE] Starting database backup for LuoKai Garden..."

docker exec "$MYSQL_CONTAINER" mysqldump -u root -p"$MYSQL_ROOT_PASS" "$DATABASE_NAME" | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

if [ $? -eq 0 ]; then
  echo "MySQL database backup succeeded: db_$DATE.sql.gz"
else
  echo "Database backup failed"
  exit 1
fi

if [ -d "/data/luokai-blog/uploads" ]; then
  tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" -C /data/luokai-blog/uploads .
  echo "Uploads backup succeeded: uploads_$DATE.tar.gz"
fi

find "$BACKUP_DIR" -type f -name "*.gz" -mtime +30 -delete

echo "[$DATE] Backup completed successfully."
