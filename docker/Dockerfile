############################
# 1) 依存解決ステージ
############################
FROM composer:2.8 AS vendor

WORKDIR /app
COPY src/composer.json src/composer.lock ./

RUN composer install \
    --no-dev \
    --prefer-dist \
    --optimize-autoloader \
    --no-interaction \
    --no-scripts

COPY src/ .

RUN composer dump-autoload --optimize \
 && php artisan package:discover --ansi

############################
# 2) 本番ステージ
############################
FROM php:8.1-fpm-alpine AS production

# 環境変数
ENV COMPOSER_ALLOW_SUPERUSER=1 \
    APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr

WORKDIR /app

# ❶ ビルド用依存をインストール（oniguruma-dev を再追加）
RUN apk add --no-cache --virtual .build-deps \
      $PHPIZE_DEPS \
      libzip-dev \
      zlib-dev \
      mariadb-dev \
      oniguruma-dev

# ❷ ランタイム用パッケージを追加
RUN apk add --no-cache \
      nginx \
      bash \
      git \
      zip \
      unzip

# ❸ PHP 拡張をビルド
RUN docker-php-ext-install \
      pdo_mysql \
      mbstring \
      zip

# ❹ ビルド依存をクリーンアップ
RUN apk del .build-deps

# ❺ Nginx と Entrypoint
COPY docker/nginx.conf           /etc/nginx/nginx.conf
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# ❻ アプリ＋vendor をステージ1 から受け渡し
COPY --from=vendor /app /app

# ❼ Laravel キャッシュ最適化
RUN php artisan config:cache \
 && php artisan route:cache  \
 && php artisan view:cache

# ❽ 必要ディレクトリと書き込み権限
RUN mkdir -p storage/framework/{sessions,views,cache} storage/logs bootstrap/cache \
 && chown -R www-data:www-data /app \
 && chmod -R ug+rwx storage bootstrap/cache

EXPOSE 8080

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
