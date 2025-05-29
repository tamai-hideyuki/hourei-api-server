# ── Multi-stage Dockerfile for Laravel API ──

# ── 開発ステージ ──
FROM php:8.1-fpm-alpine AS dev
WORKDIR /var/www

RUN apk add --no-cache oniguruma-dev libzip-dev zip unzip git

COPY src/composer.json src/composer.lock ./
RUN php -r "copy('https://getcomposer.org/installer','composer-setup.php');" \
 && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
 && rm composer-setup.php

RUN composer install --no-interaction --no-scripts --prefer-dist

COPY src/ ./

CMD ["php","artisan","serve","--host=0.0.0.0","--port=8080"]

# ── ビルドステージ ──
FROM php:8.1-fpm-alpine AS build
WORKDIR /var/www

RUN apk add --no-cache zip unzip git oniguruma-dev libzip-dev \
 && docker-php-ext-install pdo_mysql mbstring zip \
 && apk del oniguruma-dev libzip-dev

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

COPY src/composer.json src/composer.lock ./
COPY src/ ./
RUN composer install --no-dev --optimize-autoloader --no-interaction

# ── 本番ステージ ──
FROM php:8.1-fpm-alpine AS production
WORKDIR /var/www

RUN apk add --no-cache \
      nginx bash \
      zip unzip git \
      oniguruma-dev libzip-dev \
      ${PHPIZE_DEPS} \
 && docker-php-ext-install pdo_mysql mbstring zip \
 && apk del oniguruma-dev libzip-dev ${PHPIZE_DEPS} \
 && mkdir -p /var/log/nginx \
 && rm -rf /var/cache/apk/*

COPY --from=build /var/www /var/www

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh \
 && chown -R nginx:nginx /var/www \
 && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

EXPOSE 8080
ENTRYPOINT ["docker-entrypoint.sh"]
