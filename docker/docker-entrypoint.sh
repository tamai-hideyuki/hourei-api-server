#!/bin/sh
set -e

php artisan config:clear
php artisan route:clear
php artisan view:clear

if [ ! -f .env ]; then
  cp .env.example .env
  php artisan key:generate
fi

# 起動順序
php-fpm -D
nginx -g "daemon off;"

# ログを流す
tail -f /var/log/nginx/error.log
