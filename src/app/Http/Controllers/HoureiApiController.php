<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class HoureiApiController extends Controller
{
    /**
     * e-Gov API のベース URL
     */
    private string $baseUrl = 'https://laws.e-gov.go.jp/api/1';

    /**
     * カテゴリごとの法令一覧を返す
     */
    public function lawlistsByCategory($category)
    {
        // バリデーション: カテゴリは 1～13 の整数のみ
        Validator::make(
            ['category' => $category],
            ['category' => 'required|integer|min:1|max:13']
        )->validate();

        // e-Gov API 呼び出し
        $response = Http::get("{$this->baseUrl}/lawlists/{$category}");

        if (! $response->ok()) {
            return response()->json([
                'error' => 'e-Gov API error'
            ], $response->status());
        }

        // XML をパースし、名前空間 e にバインド
        $xml = simplexml_load_string($response->body());
        $xml->registerXPathNamespace('e', 'http://elaws.e-gov.go.jp/api/1/');

        // XPath で LawNameListInfo ノードを直接取得
        $nodes = $xml->xpath('//e:LawNameListInfo');

        // 各ノードから必要データを抽出
        $items = array_map(fn($el) => [
            'id'   => (string) $el->LawId,
            'name' => (string) $el->LawName,
        ], $nodes);

        return response()->json($items);
    }

    /**
     * 法令一覧（XML）を返す
     */
    public function lawlists(string $category)
    {
        $response = Http::get("{$this->baseUrl}/lawlists/{$category}");
        return response($response->body(), $response->status())
            ->header('Content-Type', 'application/xml');
    }

    /**
     * 法令データ（XML）を返す
     */
    public function lawdata(Request $request)
    {
        $id  = $request->query('lawId');
        $num = $request->query('lawNum');

        $endpoint = $id ? "lawdata/{$id}" : "lawdata/{$num}";
        $response = Http::get("{$this->baseUrl}/{$endpoint}");

        return response($response->body(), $response->status())
            ->header('Content-Type', 'application/xml');
    }

    /**
     * 条文取得（XML）を返す
     */
    public function articles(Request $request)
    {
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

        $uri = "{$this->baseUrl}/articles;" . implode(';', $segments);
        $response = Http::get($uri);

        return response($response->body(), $response->status())
            ->header('Content-Type', 'application/xml');
    }

    /**
     * 更新法令リスト（XML）を返す
     */
    public function updatelawlists(string $date)
    {
        $response = Http::get("{$this->baseUrl}/updatelawlists/{$date}");
        return response($response->body(), $response->status())
            ->header('Content-Type', 'application/xml');
    }
}
