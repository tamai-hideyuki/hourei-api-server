#!/bin/sh
set -e

cd /var/www

# キャッシュクリア＆キー設定
php artisan config:clear
php artisan route:clear
php artisan view:clear

if [ ! -f .env ]; then
  cp .env.example .env
  php artisan key:generate --force
fi

# PHP-FPM と Nginx を起動
php-fpm -D
nginx -g "daemon off;"
