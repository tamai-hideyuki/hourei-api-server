<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // 許可するオリジンを列挙
        $allowed = [
            'http://localhost:5173',
            'http://192.168.1.10:5173',
            'http://192.168.3.41:5173',
        ];
        $origin = $request->headers->get('Origin');

        if (in_array($origin, $allowed, true)) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            $response->headers->set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
        }

        // プレフライト
        if ($request->getMethod() === 'OPTIONS') {
            $response->setStatusCode(204)->setContent('');
        }

        return $response;
    }
}
