<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Fideloper\Proxy\TrustProxies as Middleware;

class TrustProxies extends Middleware
{
    /**
     * すべてのプロキシを信頼する設定
     *
     * @var array|string|null
     */
    protected $proxies = '*';

    /**
     * リクエストヘッダーから信頼すべきヘッダーを定義
     *
     * @var int
     */
    protected $headers = Request::HEADER_X_FORWARDED_ALL;
}
