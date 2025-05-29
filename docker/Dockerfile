# ── Multi-stage Dockerfile for Laravel API ──

# ── 共通変数 ──
ARG PHP_VERSION=8.1
ARG WORKDIR_PATH=/var/www/html

# ── 開発ステージ ──
FROM php:${PHP_VERSION}-fpm-alpine AS dev
WORKDIR ${WORKDIR_PATH}

# ビルドツール＋依存パッケージ（dev用）
RUN apk add --no-cache \
      oniguruma-dev libzip-dev zip unzip git \
      ${PHPIZE_DEPS} \
 && docker-php-ext-install mbstring zip pdo_mysql \
 && apk del ${PHPIZE_DEPS}

# Composer（ビルド環境）
COPY src/composer.json src/composer.lock ./
RUN php -r "copy('https://getcomposer.org/installer','composer-setup.php');" \
 && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
 && rm composer-setup.php

# 依存インストール
RUN composer install --no-interaction --no-scripts --prefer-dist

# ソース全文を配置
COPY src/ ./

# 開発サーバ起動
CMD ["php","artisan","serve","--host=0.0.0.0","--port=8080"]


# ── ビルドステージ ──
FROM php:${PHP_VERSION}-fpm-alpine AS build
WORKDIR ${WORKDIR_PATH}

# 最小限のビルド依存のみ
RUN apk add --no-cache --virtual .build-deps \
      zip unzip git oniguruma-dev libzip-dev ${PHPIZE_DEPS} \
 && docker-php-ext-install mbstring zip pdo_mysql \
 && apk del .build-deps \
 && rm -rf /var/cache/apk/*

# Composer は公式イメージから拝借
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

# 依存解決
COPY src/composer.json src/composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction

# ソース全文を配置
COPY src/ ./


# ── 本番ステージ ──
FROM php:${PHP_VERSION}-fpm-alpine AS production
WORKDIR ${WORKDIR_PATH}

# ランタイム＋Nginx
RUN apk add --no-cache nginx bash \
 && mkdir -p /var/log/nginx

# buildステージからファイルを丸ごとコピー
COPY --from=build ${WORKDIR_PATH} ${WORKDIR_PATH}

# Nginx 設定とエントリーポイント
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# パーミッション調整
RUN chmod +x /usr/local/bin/docker-entrypoint.sh \
 && chown -R nginx:nginx ${WORKDIR_PATH} \
 && chmod -R 775 ${WORKDIR_PATH}/storage ${WORKDIR_PATH}/bootstrap/cache

EXPOSE 8080
ENTRYPOINT ["docker-entrypoint.sh"]
