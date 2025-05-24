<?php

use Illuminate\Support\Facades\Route;


Route::get('/ping', function () {
    return response()->json(['status' => 'ok'], 200);
});


Route::get('/', function () {
    return view('welcome');
});
