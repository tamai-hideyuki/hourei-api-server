<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class HoureiApiController extends Controller
{
    private string $baseUrl = 'https://laws.e-gov.go.jp/api/1';

    public function lawlists(string $category)
    {
        $response = Http::get("{$this->baseUrl}/lawlists/{$category}");
        return response($response->body(), $response->status())
            ->header('Content-Type', 'application/xml');
    }

    public function lawdata(Request $request)
    {
        $id = $request->query('lawId');
        $num = $request->query('lawNum');

        $endpoint = $id ? "lawdata/{$id}" : "lawdata/{$num}";
        $response = Http::get("{$this->baseUrl}/{$endpoint}");

        return response($response->body(), $response->status())
            ->header('Content-Type', 'application/xml');
    }

    public function articles(Request $request)
    {
        $baseUrl = 'https://laws.e-gov.go.jp/api/1';
        $segments = [];

        if ($request->has('lawId')) {
            $segments[] = 'lawId=' . $request->query('lawId');
        } elseif ($request->has('lawNum')) {
            $segments[] = 'lawNum=' . $request->query('lawNum');
        }

        if ($request->has('article')) {
            $segments[] = 'article=' . $request->query('article');
        }
        if ($request->has('paragraph')) {
            $segments[] = 'paragraph=' . $request->query('paragraph');
        }
        if ($request->has('appdxTable')) {
            $segments[] = 'appdxTable=' . $request->query('appdxTable');
        }

        $uri = $baseUrl . '/articles;' . implode(';', $segments);

        $response = Http::get($uri);

        return response($response->body(), $response->status())
            ->header('Content-Type', 'application/xml');
    }

    public function updatelawlists(string $date)
    {
        $response = Http::get("{$this->baseUrl}/updatelawlists/{$date}");
        return response($response->body(), $response->status())
            ->header('Content-Type', 'application/xml');
    }
}
