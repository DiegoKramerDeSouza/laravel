<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

//Encaminha para o Controller ContatoController > app/Http/Controllers/ContatoController
//Método index
Route::get('/salas/{id?}', ['uses' => 'ContatoController@index']);
//Método criar
Route::post('/controle/{id?}', ['uses' => 'ContatoController@criar']);
//Método editar
Route::put('/controle/{id?}', ['uses' => 'ContatoController@editar']);
