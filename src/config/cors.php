<?php

return [

    // 1. CORS が有効か
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // 2. 許可するオリジン
    'allowed_origins' => [
        'http://localhost:5173',
        'http://192.168.1.10:5173',
        'http://localhost:8082',       // フェッチを行うフロントの URL
        'http://192.168.1.10:8082',
        '*',                            // 開発中はワイルドカードも可
    ],

    // 3. 許可する HTTP メソッド
    'allowed_methods' => ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],

    // 4. 許可するカスタムヘッダー
    'allowed_headers' => ['*'],

    // 5. 送信済みクレデンシャル（Cookie 等）を許可するか
    'supports_credentials' => false,
];
