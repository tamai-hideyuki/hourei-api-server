# 1) Composer 専用ステージ
FROM composer:2 AS vendor

# 作業ディレクトリを /src に
WORKDIR /src

# composer.json と composer.lock を先にコピー（キャッシュ効率のため）
COPY src/composer.json src/composer.lock ./

# 依存関係をインストール（/src/vendor が生成される）
RUN composer install \
    --no-dev \
    --no-scripts \
    --optimize-autoloader \
    --no-interaction

# 残りのアプリケーションコードをコピー
COPY src/ ./

# 2) 本番ステージ
FROM php:8.1-fpm-alpine AS production

# 1. 必要パッケージ＆PHP拡張のインストール
RUN apk add --no-cache \
      nginx \
      bash \
      zip \
      unzip \
      git \
      oniguruma-dev \
      libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring zip \
    && apk del oniguruma-dev libzip-dev

# 2. Nginx と Entrypoint スクリプト配置
COPY docker/nginx.conf           /etc/nginx/nginx.conf
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 3. 作業ディレクトリを /src に
WORKDIR /src

# 4. vendor を含めたアプリケーションをステージ1 からコピー
COPY --from=vendor /src /src

# 5. Laravel 最適化コマンド
RUN php artisan config:cache \
 && php artisan route:cache \
 && php artisan view:cache

# 6. 必要ディレクトリの作成と権限設定
RUN mkdir -p \
      storage/framework/{sessions,views,cache} \
      storage/logs \
      bootstrap/cache \
    && chown -R nginx:nginx /src \
    && chmod -R 775 /src/storage /src/bootstrap/cache

# 7. ポート開放 & Entrypoint
EXPOSE 8080
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
