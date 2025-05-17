FROM node:20-alpine

WORKDIR /app

# package.json のみコピー（lockファイルなし）
COPY frontend/package.json ./package.json

# 依存インストール
RUN npm install --legacy-peer-deps

# 残りのソースをまとめてコピー
COPY frontend/ ./

# 保険で vite をグローバルインストール
RUN npm install -g vite

# npx で起動し、外部アクセスを許可
CMD ["npx", "vite", "--host", "0.0.0.0"]
