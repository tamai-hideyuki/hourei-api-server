# ── Multi-stage Dockerfile for Laravel API ──

#########################
# 1️⃣ 開発ステージ (dev) #
#########################
FROM php:8.1-fpm-alpine AS dev
WORKDIR /var/www        # ← 以降すべてのステージで同じパス

RUN apk add --no-cache oniguruma-dev libzip-dev zip unzip git

# ─ Composer ─
COPY src/composer.json src/composer.lock ./
RUN php -r "copy('https://getcomposer.org/installer','composer-setup.php');" \
 && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
 && rm composer-setup.php

RUN composer install --no-interaction --no-scripts --prefer-dist

# アプリ全文
COPY src/ ./

CMD ["php","artisan","serve","--host=0.0.0.0","--port=8080"]


#########################
# 2️⃣ ビルドステージ (build)
#########################
FROM php:8.1-fpm-alpine AS build
WORKDIR /var/www

# ランタイム依存（libzip は残す）
RUN apk add --no-cache libzip zip unzip git

# ビルド専用依存で拡張をビルド
RUN apk add --no-cache --virtual .build-deps \
      libzip-dev oniguruma-dev ${PHPIZE_DEPS} \
 && docker-php-ext-install mbstring zip pdo_mysql \
 && apk del .build-deps \
 && rm -rf /var/cache/apk/*

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
COPY src/ ./

RUN composer install --no-dev --optimize-autoloader --no-interaction


#########################
# 3️⃣ 本番ステージ (production)
#########################
FROM php:8.1-fpm-alpine AS production
WORKDIR /var/www

# Nginx と便利ツール
RUN apk add --no-cache nginx bash \
 && mkdir -p /var/log/nginx

# ビルド済みアプリを配置
COPY --from=build /var/www /var/www

# ── Laravel の public と Nginx ルートを揃える ──
# Alpine の nginx デフォルト公開ディレクトリを Laravel 側に向ける
RUN rm -rf /usr/share/nginx/html \
 && ln -s /var/www/public /usr/share/nginx/html

# Nginx 設定 & Entrypoint
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh \
 && chown -R nginx:nginx /var/www \
 && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

EXPOSE 8080
ENTRYPOINT ["docker-entrypoint.sh"]
