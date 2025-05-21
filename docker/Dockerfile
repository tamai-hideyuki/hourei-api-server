# Multi-stage Dockerfile for Laravel API

# ── 開発ステージ ──
FROM php:8.2-fpm-alpine AS dev
WORKDIR /app

# システムパッケージのインストール
RUN apk add --no-cache oniguruma-dev libzip-dev zip unzip git

# Composer（ビルド環境）
COPY src/composer.json src/composer.lock ./
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && rm composer-setup.php

# Laravel依存インストール
RUN composer install --no-interaction --no-scripts --prefer-dist

# ソースコードをコピー
COPY src/ ./

# 開発サーバ起動コマンド
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]

# ── ビルドステージ ──
FROM dev AS build
WORKDIR /app

# 本番向け依存最適化
RUN composer install --no-dev --optimize-autoloader --no-interaction && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# ── 本番ステージ ──
FROM php:8.2-fpm-alpine AS production
WORKDIR /app

# PHP拡張のインストール
RUN apk add --no-cache oniguruma-dev libzip-dev zip unzip && \
    docker-php-ext-install pdo_mysql mbstring zip

# ビルド成果物をコピー
COPY --from=build /app /app

# パーミッション設定
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache

# 環境変数
ENV APP_ENV=production \
    APP_DEBUG=false

EXPOSE 8000
CMD ["php-fpm"]
