# 📚 Hourei API Server

**Laravel 12.x + React + Docker** で構築した、[📘 e‑Gov 法令 API](https://elaws.e-gov.go.jp/) をラップする **中継 API サーバー & 最小検索 UI** です。

- **バックエンド** : Laravel 12.x で API4種類を中継（法令一覧 / 本文 / 条文 / 更新情報）
- **フロントエンド** : Vite + React + Tailwind CSS で “法令一覧 → 条文取得” の簡易 UI
- **コンテナ** : Nginx / PHP-FPM / MySQL / Node を docker-compose でワンコマンド起動

このリポジトリを `git clone` して `docker compose up -d` するだけで、バックエンド API とフロント UI の双方が即座に確認できます。

---

## 🛠 技術スタックバッジ

![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)

#### API 形式
![REST API](https://img.shields.io/badge/REST%20API-6DB33F?style=for-the-badge&logo=api&logoColor=white)
![XML](https://img.shields.io/badge/XML-EB5E28?style=for-the-badge&logo=html5&logoColor=white)

#### 補助ツール
![Curl](https://img.shields.io/badge/cURL-005571?style=for-the-badge&logo=curl&logoColor=white)

---

## 🚀 クイックスタート

```bash
# クローン
git clone https://github.com/tamai-hideyuki/hourei-api-server.git
cd hourei-api-server

# コンテナ起動（API :8082 / Front :5173）
docker compose up -d
```

| サービス       | URL                                            | 用途                  |
| ---------- | ---------------------------------------------- | ------------------- |
| API Server | [http://localhost:8082](http://localhost:8082) | Laravel 中継 API      |
| Front End  | [http://localhost:5173](http://localhost:5173) | React + Tailwind UI |

## 🔗 バックエンド API 一覧
| 種別    | エンドポイント                                   | 説明                       |
| ----- | ----------------------------------------- | ------------------------ |
| 動作確認  | /api/hourei/ping                          | サーバーが稼働しているか確認           |
| 法令名一覧 | /api/hourei/lawlists/{category}           | 全法令 / 憲法 / 政令などカテゴリ別一覧取得 |
| 法令全文  | /api/hourei/lawdata?lawNum=… または lawId=…  | 該当法令の全文を取得               |
| 条文内容  | /api/hourei/articles?lawId=…\&article=第X条 | 任意条文を取得（セミコロン構文対応）       |
| 更新法令  | /api/hourei/updatelawlists/{yyyyMMdd}     | 指定日付の更新法令一覧              |

## 🖥️ フロントエンド最小 UI
- 法令一覧 API を呼び出しselect に動的表示
- 入力した「第X条」を URL エンコードして条文 API へフェッチ
- Tailwind CSS でシンプルなモダン UI
- CORS 対応 : 自作 CorsMiddleware で Access-Control-Allow-Origin: http://localhost:5173 を付与し、ブラウザから直接呼び出し可能

## 🧪 動作確認例（curl）
```
curl http://localhost:8082/api/hourei/ping
curl http://localhost:8082/api/hourei/lawlists/1
curl "http://localhost:8082/api/hourei/lawdata?lawNum=平成十五年法律第五十七号"
curl "http://localhost:8082/api/hourei/articles?lawId=415AC0000000057&article=第十一条"
curl http://localhost:8082/api/hourei/updatelawlists/20240501
```

## ⚙️ 環境変数（.env）
- .env.example をコピーしてご利用ください。

| 変数                   | 例                                              | 用途                    |
| -------------------- | ---------------------------------------------- | --------------------- |
| APP\_URL             | [http://localhost:8082](http://localhost:8082) | Laravel 基本 URL        |
| WEB\_PORT            | 8082                                           | API 公開ポート             |
| DB\_\*               | -                                              | MySQL 設定              |
| VITE\_API\_BASE\_URL | [http://localhost:8082](http://localhost:8082) | React から API へのベースURL |


## 🗂 主要ファイル
```
src/app/Http/Controllers/HoureiApiController.php   # バックエンド中継ロジック
src/app/Http/Middleware/CorsMiddleware.php         # 自作 CORS ミドルウェア
src/routes/api.php                                 # API ルーティング
frontend/src/App.jsx                               # React 検索 UI
frontend/vite.config.js                            # 開発サーバー & API プロキシ設定
.env.example                                       # 環境変数テンプレート
```

## 📝 補足
- Laravel 12.* (withRouting) で軽量構成
- フロントは 最小コードで即試せるサンプルとして実装

## 🛠 今後のロードマップ
- ?format=json で JSON 変換レスポンス
- OpenAPI (Swagger UI) 自動生成
- 条番号オートコンプリート & 別表検索対応
- Next.js / Astro 等への UI 拡張