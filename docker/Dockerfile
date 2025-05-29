############################
# 1) 依存解決ステージ
############################
FROM composer:2.8 AS vendor
ENV COMPOSER_ALLOW_SUPERUSER=1 \
    APP_ENV=production

WORKDIR /app

#  キャッシュ効率：先に composer.* のみ
COPY src/composer.json src/composer.lock ./

# Laravel の post-autoload 処理を実行
RUN composer install \
    --no-dev \
    --prefer-dist \
    --optimize-autoloader \
    --no-interaction

# 依存が固まってからソース一式を投入
COPY src/ .

############################
# 2) 本番ステージ
############################
FROM php:8.1-fpm-alpine AS production

# ❹ 必要最小限の OS/PHP 拡張をインストール
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS libzip-dev oniguruma-dev \
 && apk add --no-cache nginx bash git zip unzip \
 && docker-php-ext-install pdo_mysql mbstring zip \
 && apk del .build-deps

# Nginx & Entrypoint
COPY docker/nginx.conf           /etc/nginx/nginx.conf
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

WORKDIR /app

# アプリ＋vendor まとめて受け渡し（キャッシュ済み）
COPY --from=vendor /app /app

# Laravel 最適化
RUN php artisan config:cache \
 && php artisan route:cache  \
 && php artisan view:cache

# パーミッション調整
RUN mkdir -p storage/framework/{sessions,views,cache} storage/logs bootstrap/cache \
 && chown -R www-data:www-data /app \
 && chmod -R ug+rwx storage bootstrap/cache

EXPOSE 8080
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
