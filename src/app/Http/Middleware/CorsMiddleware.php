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

        // localhost:5173 と IP:5173 の両方を許可
        $allowed = [
            'http://localhost:5173',
            'http://192.168.1.10:5173',
        ];
        $origin = $request->headers->get('Origin');

        if (in_array($origin, $allowed)) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            $response->headers->set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
        }

        if ($request->getMethod() === 'OPTIONS') {
            $response->setStatusCode(204)->setContent('');
        }

        return $response;
    }
}
