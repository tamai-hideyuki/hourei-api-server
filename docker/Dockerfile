# Multi-stage Dockerfile for Laravel API

# ── 開発ステージ ──
FROM php:8.1-fpm-alpine AS dev
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
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]

# ── ビルドステージ ──
FROM php:8.1-fpm-alpine AS build

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
FROM php:8.1-fpm-alpine AS production
WORKDIR /var/www

# ビルドツール＋必要ライブラリを追加し、拡張をビルド後に削除
RUN apk add --no-cache \
      nginx bash \
      zip unzip git \
      oniguruma-dev libzip-dev \
      ${PHPIZE_DEPS} \
 && docker-php-ext-install \
      pdo_mysql \
      mbstring \
      zip \
 && apk del \
      oniguruma-dev libzip-dev \
      ${PHPIZE_DEPS}

RUN mkdir -p /var/log/nginx
COPY --from=build /var/www /var/www
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh \
 && chown -R nginx:nginx /var/www \
 && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

EXPOSE 8080
ENTRYPOINT ["docker-entrypoint.sh"]
