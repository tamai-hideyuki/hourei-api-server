# 📚 Hourei API Server

**Laravel 12.x + Docker構成**で構築された、  
[📘e-Gov法令API](https://elaws.e-gov.go.jp/)をラップする中継型のAPIサーバーです。

このサーバーにアクセスすることで、クライアントは**法令一覧・全文・条文・更新情報**を簡単に取得できます。

---

## 🛠 技術スタックバッジ

![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)

#### API形式
![REST API](https://img.shields.io/badge/REST%20API-6DB33F?style=for-the-badge&logo=api&logoColor=white)
![XML](https://img.shields.io/badge/XML-EB5E28?style=for-the-badge&logo=html5&logoColor=white)

#### 補助ツール
![Curl](https://img.shields.io/badge/cURL-005571?style=for-the-badge&logo=curl&logoColor=white)


## 🚀 起動方法

```bash
git clone https://github.com/tamai-hideyuki/hourei-api-server.git
cd hourei-api-server

# Docker 起動
docker compose up -d
```
## 🔗 API一覧
| 種別         | エンドポイント                                          | 説明                    |
| ---------- | ------------------------------------------------ | --------------------- |
|  動作確認      | `/api/hourei/ping`                               | サーバーが稼働しているか確認します     |
|  法令名一覧取得  | `/api/hourei/lawlists/{category}`                | 全法令・憲法・政令などカテゴリ別一覧を取得 |
|  法令全文取得   | `/api/hourei/lawdata?lawNum=...` または `lawId=...` | 該当法令の全文を取得            |
|  条文内容取得   | `/api/hourei/articles?lawId=...&article=第X条`     | 指定された条文（セミコロン構文対応）    |
|  更新法令一覧取得 | `/api/hourei/updatelawlists/{yyyyMMdd}`          | 指定日付の更新法令一覧を取得        |

## 📦 レスポンス仕様
- Content-Type: application/xml
- HTTPステータス: 200, 400, 404, 500 に準拠

## 📄 レスポンス例（/api/hourei/ping）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Ping>
  <Status>ok</Status>
  <Timestamp>2025-05-17T11:34:56+09:00</Timestamp>
</Ping>
```

## 🧪 動作確認（curl例）
```
curl http://localhost:8082/api/hourei/ping

curl http://localhost:8082/api/hourei/lawlists/1
curl "http://localhost:8082/api/hourei/lawdata?lawNum=平成十五年法律第五十七号"
curl "http://localhost:8082/api/hourei/articles?lawId=415AC0000000057&article=第十一条"
curl http://localhost:8082/api/hourei/updatelawlists/20240501

```
## ⚙️ 環境変数（.env）

このプロジェクトには `.env.example` を同梱しています。  
クローン後、`.env` にコピーして内容を適宜設定してください。

| 変数名 | 例 | 説明 |
|--------|-----|------|
| `APP_ENV`, `APP_DEBUG`, `APP_URL` | `local`, `true`, `http://localhost:8082` | Laravel本体の実行環境設定 |
| `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_NAME` | `mysql`, `db`, `3306`, `hourei-api-server` | Docker内のMySQL接続情報 |
| `DB_USER`, `DB_PASSWORD`, `DB_ROOT_PASSWORD` | `your_db_user`, `your_db_password`, `secret_root_password` | **任意の値を設定してください（公開NG）** |
| `WEB_PORT` | `8082` | Laravelアプリをホスト側に公開するポート番号 |
| `PHP_DOCKERFILE` | `docker/php/Dockerfile` | PHPコンテナのビルド元ファイルパス |
| `*_CONTAINER_NAME` | `hourei-api-server_app` 等 | 各Dockerコンテナ名（オーバーライド用途） |



## 🗂 本APIで作成・編集した主なファイル
```plaintext
src/app/Http/Controllers/HoureiApiController.php  # e-Gov APIへの中継処理ロジック（全4種）
src/routes/api.php                                # APIルート定義（/api/hourei/*）
.env.example                                       # 開発用の環境変数テンプレート
```

## 📝 補足
- Laravel 12.* 環境（routes/api.php は withRouting() で明示）
- セミコロン構文を正確に処理するため、articles APIのURIは動的生成
- 外部公開の予定がある場合は認証やRate Limitingを追加推奨

## 🛠 今後の改善予定
- JSON形式への変換オプション（?format=json）
- OpenAPI仕様の導入（Swagger）
- 検索画面などのUI連携
- 