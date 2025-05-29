# 1) Composer 専用ステージ
FROM composer:2 AS vendor
WORKDIR /app
COPY src/composer.json src/composer.lock ./
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-scripts \
    --no-interaction

# 2) 本番ステージ
FROM php:8.1-fpm-alpine AS production

# ← 環境を production に
ENV APP_ENV=production \
    APP_DEBUG=false

WORKDIR /var/www

RUN apk add --no-cache \
      nginx \
      bash \
      zip unzip git oniguruma-dev libzip-dev libzip \
    && docker-php-ext-install pdo_mysql mbstring zip \
    && apk del oniguruma-dev libzip-dev

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# アプリ／依存をまとめてコピー
COPY src/ ./
COPY --from=vendor /app/vendor ./vendor

# ← package:discover は実行しない

RUN chown -R nginx:nginx /var/www \
 && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

EXPOSE 8080
ENTRYPOINT ["docker-entrypoint.sh"]
