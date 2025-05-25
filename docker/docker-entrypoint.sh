#!/bin/sh
set -e

# キャッシュクリア
php artisan config:clear
php artisan route:clear
php artisan view:clear

# .env がなければ生成
if [ ! -f .env ]; then
  cp .env.example .env
  php artisan key:generate
fi

# php-fpm をバックグラウンド起動
php-fpm -D

# nginx をフォアグラウンド起動
nginx -g "daemon off;"

# Laravelの準備
php-fpm -D
nginx -g "daemon off;" &

# nginxのエラーログをtailしてApp Runnerに生かす
tail -f /var/log/nginx/error.log
