<?php

use Illuminate\Support\Facades\Route;


Route::get('/health', fn () => response()->json(['status' => 'ok'], 200));

Route::get('/', function () {
    return view('welcome');
});
