<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HoureiApiController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::prefix('hourei')->group(function () {
    Route::get('/lawlists/{category}', [HoureiApiController::class, 'lawlists']);       // 法令名一覧
    Route::get('/lawdata', [HoureiApiController::class, 'lawdata']);                     // 法令全文
    Route::get('/articles', [HoureiApiController::class, 'articles']);                   // 条文内容
    Route::get('/updatelawlists/{date}', [HoureiApiController::class, 'updatelawlists']); // 更新法令一覧
});
