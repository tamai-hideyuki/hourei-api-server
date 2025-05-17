# 📚 Hourei API Server

**Laravel 12.x + Docker構成**で構築された、  
[📘e-Gov法令API](https://elaws.e-gov.go.jp/)をラップする中継型のAPIサーバーです。

このサーバーにアクセスすることで、クライアントは**法令一覧・全文・条文・更新情報**を簡単に取得できます。

---

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

## 🧪 動作確認（curl例）
```
curl http://localhost:8082/api/hourei/ping

curl http://localhost:8082/api/hourei/lawlists/1
curl "http://localhost:8082/api/hourei/lawdata?lawNum=平成十五年法律第五十七号"
curl "http://localhost:8082/api/hourei/articles?lawId=415AC0000000057&article=第十一条"
curl http://localhost:8082/api/hourei/updatelawlists/20240501

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