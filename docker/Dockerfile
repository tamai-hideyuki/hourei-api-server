# Multi-stage Dockerfile for Laravel API

# ── 開発ステージ ──
FROM php:8.2-fpm-alpine AS dev
WORKDIR /app

# システムパッケージのインストール
RUN apk add --no-cache oniguruma-dev libzip-dev zip unzip git

# Composer（ビルド環境）
COPY src/composer.json src/composer.lock ./
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && rm composer-setup.php

# Laravel依存インストール
RUN composer install --no-interaction --no-scripts --prefer-dist

# ソースコードをコピー
COPY src/ ./

# 開発サーバ起動コマンド
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]

# ── ビルドステージ ──
FROM php:8.2-fpm-alpine AS build

WORKDIR /var/www

# 必要ライブラリ＆拡張インストール
RUN apk add --no-cache zip unzip git oniguruma-dev libzip-dev \
 && docker-php-ext-install pdo_mysql mbstring zip \
 && apk del oniguruma-dev libzip-dev

# composerインストール
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

# ソースをコピーして依存解決
COPY src/composer.json src/composer.lock ./
COPY src/ .
RUN composer install --no-dev --optimize-autoloader --no-interaction

# ── 本番ステージ ──
FROM php:8.2-fpm-alpine AS production

# php-fpm & nginx のインストール
RUN apk add --no-cache nginx bash

WORKDIR /var/www

# ビルド成果物コピー
COPY --from=build /var/www /var/www

# nginx 設定
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Entrypoint スクリプト
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# パーミッション調整
RUN chown -R nginx:nginx /var/www \
 && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

 # App Runner は常に 8080 を見る
EXPOSE 8080

ENTRYPOINT ["docker-entrypoint.sh"]
