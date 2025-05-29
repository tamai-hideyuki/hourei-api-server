############################
# 1) 依存解決ステージ
############################
FROM composer:2.8 AS vendor

WORKDIR /app

# 依存解決のみ実行
COPY src/composer.json src/composer.lock ./
RUN composer install \
    --no-dev \
    --prefer-dist \
    --optimize-autoloader \
    --no-interaction \
    --no-scripts

# アプリ本体をコピーし、post-autoload スクリプトを走らせる
COPY src/ .
RUN composer dump-autoload --optimize \
 && php artisan package:discover --ansi

############################
# 2) 本番ステージ
############################
FROM php:8.1-fpm-slim AS production

# 環境変数
ENV COMPOSER_ALLOW_SUPERUSER=1 \
    APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr

WORKDIR /app

# システム依存関係とビルドツールを一度にインストール
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      nginx \
      git \
      zip \
      unzip \
      bash \
      # PHP 拡張ビルドに必要なライブラリとツール
      libzip-dev \
      libonig-dev \
      zlib1g-dev \
      default-libmysqlclient-dev \
      build-essential \
      pkg-config \
 && docker-php-ext-install \
      pdo_mysql \
      mbstring \
      zip \
 && apt-get purge -y build-essential pkg-config \
 && apt-get autoremove -y \
 && rm -rf /var/lib/apt/lists/*

# Nginx と Entrypoint スクリプト配置
COPY docker/nginx.conf           /etc/nginx/nginx.conf
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# アプリ本体を vendor と共にステージ1 から受け渡し
COPY --from=vendor /app /app

# Laravel のキャッシュを生成
RUN php artisan config:cache \
 && php artisan route:cache  \
 && php artisan view:cache

# 書き込みディレクトリの権限設定
RUN mkdir -p storage/framework/{sessions,views,cache} storage/logs bootstrap/cache \
 && chown -R www-data:www-data /app \
 && chmod -R ug+rwx storage bootstrap/cache

EXPOSE 8080

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
