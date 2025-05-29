<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HoureiApiController;


Route::get('/health', fn() => response()->json(['status' => 'ok']));



Route::get('/hourei/lawlists/category/{category}', [HoureiApiController::class, 'lawlistsByCategory']);


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::prefix('hourei')->group(function () {
    Route::get('/lawlists/{category}', [HoureiApiController::class, 'lawlists']);       // 法令名一覧
    Route::get('/lawdata', [HoureiApiController::class, 'lawdata']);                     // 法令全文
    Route::get('/articles', [HoureiApiController::class, 'articles']);                   // 条文内容
    Route::get('/updatelawlists/{date}', [HoureiApiController::class, 'updatelawlists']); // 更新法令一覧
});

Route::get('/hourei/ping', function (){
    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<Ping>';
    $xml .= '<Status>ok</Status>';
    $xml .= '<Timestamp>' . now()->setTimezone('Asia/Tokyo')->toIso8601String() . '</Timestamp>';
    $xml .= '</Ping>';

    return response($xml, 200)->header('Content-Type', 'application/xml');
});


