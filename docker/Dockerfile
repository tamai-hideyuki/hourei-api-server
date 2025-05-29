# 1) Composer 専用ステージ
FROM composer:2 AS vendor
WORKDIR /app

# composer.json / lock のみコピーして依存解決
COPY src/composer.json src/composer.lock ./
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction

# 2) 本番ステージ
FROM php:8.1-fpm-alpine AS production
WORKDIR /var/www

# 必要パッケージ＆PHP拡張のインストール
RUN apk add --no-cache \
      nginx \
      bash \
      zip unzip git oniguruma-dev libzip-dev libzip \
    && docker-php-ext-install pdo_mysql mbstring zip \
    && apk del oniguruma-dev libzip-dev

# nginx と Entrypoint
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# アプリケーションコードを丸ごとコピーする
COPY src/ ./

# vendor をマージする
COPY --from=vendor /app/vendor ./vendor

RUN php artisan package:discover --ansi

# 権限調整
RUN chown -R nginx:nginx /var/www \
 && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

EXPOSE 8080
ENTRYPOINT ["docker-entrypoint.sh"]
