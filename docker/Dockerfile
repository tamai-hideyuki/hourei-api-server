# ── Multi-stage Dockerfile for Laravel API ──

# ── 開発ステージ ──
FROM php:8.1-fpm-alpine AS dev
WORKDIR /var/www/html

# 開発時に必要なツールと拡張を一度にインストールし、ビルド用依存を削除
RUN apk add --no-cache --virtual .build-deps \
      oniguruma-dev libzip-dev zip unzip git ${PHPIZE_DEPS} \
    && docker-php-ext-install mbstring zip pdo_mysql \
    && apk del .build-deps \
    && rm -rf /var/cache/apk/*

# Composer インストール
COPY src/composer.json src/composer.lock ./
RUN php -r "copy('https://getcomposer.org/installer','composer-setup.php');" \
 && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
 && rm composer-setup.php

# 依存解決（開発用）
RUN composer install --no-interaction --no-scripts --prefer-dist

# ソースコード配置
COPY src/ ./

# 開発サーバ起動
CMD ["php","artisan","serve","--host=0.0.0.0","--port=8080"]


# ── ビルドステージ ──
FROM php:8.1-fpm-alpine AS build
WORKDIR /var/www/html

RUN apk add --no-cache \
      libzip            \
      zip unzip git


RUN apk add --no-cache --virtual .build-deps \
      oniguruma-dev ${PHPIZE_DEPS} \
 && docker-php-ext-install mbstring zip pdo_mysql \
 && apk del .build-deps \
 && rm -rf /var/cache/apk/*

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

COPY src/ ./

RUN composer install --no-dev --optimize-autoloader --no-interaction


# ── 本番ステージ ──
FROM php:8.1-fpm-alpine AS production
WORKDIR /var/www/html

# ランタイム＆Nginx インストール
RUN apk add --no-cache nginx bash \
    && mkdir -p /var/log/nginx

# build ステージから全ファイルを引き継ぎ
COPY --from=build /var/www/html /var/www/html

# Nginx 設定と Entrypoint
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# パーミッション調整
RUN chmod +x /usr/local/bin/docker-entrypoint.sh \
 && chown -R nginx:nginx /var/www/html \
 && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 8080
ENTRYPOINT ["docker-entrypoint.sh"]
