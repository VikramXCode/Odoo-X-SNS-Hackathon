# This script will create a backup of the global_router_media volume and store it in the current directory as global-router-backup.tar.gz

docker run --rm \
  -v global_router_media:/backup-volume \
  -v "$(pwd)":/backup \
  busybox \
  tar -zcvf /backup/global-router-backup.tar.gz /backup-volume