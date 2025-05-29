############################
# 1) 依存解決ステージ
############################
FROM composer:2.8 AS vendor
WORKDIR /app
COPY src/composer.json src/composer.lock ./
RUN composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction --no-scripts
COPY src/ .
RUN composer dump-autoload --optimize \
 && php artisan package:discover --ansi

############################
# 2) 本番ステージ
############################
FROM php:8.1-fpm-alpine AS production
WORKDIR /app

# ❹ ビルド依存と必要ライブラリを一気に導入
RUN apk add --no-cache --virtual .build-deps \
      $PHPIZE_DEPS \
      libzip-dev \
      oniguruma-dev \
      zlib-dev && \
    apk add --no-cache \
      nginx \
      bash \
      git \
      zip \
      unzip

# ❺ zip のみ configure し、mbstring はそのままインストール
RUN docker-php-ext-configure zip --with-libzip && \
    docker-php-ext-install \
      pdo_mysql \
      mbstring \
      zip



# ❻ ビルド依存だけ削除し軽量化
RUN apk del .build-deps

# ❼ Nginx と Entrypoint
COPY docker/nginx.conf           /etc/nginx/nginx.conf
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# ❽ アプリ＋vendor をステージ1 から受け渡し
COPY --from=vendor /app /app

# ❾ Laravel キャッシュ生成
RUN php artisan config:cache \
 && php artisan route:cache  \
 && php artisan view:cache

# ❿ パーミッション調整＆公開ポート
RUN mkdir -p storage/framework/{sessions,views,cache} storage/logs bootstrap/cache \
 && chown -R www-data:www-data /app \
 && chmod -R ug+rwx storage bootstrap/cache

EXPOSE 8080
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
