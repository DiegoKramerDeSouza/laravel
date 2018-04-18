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
//Rota - index
Route::get('/salas/{id?}', ['uses' => 'ContatoController@index']);
//Rota - criar
Route::post('/controle/{id?}', ['uses' => 'ContatoController@criar']);
//Rota - editar
Route::put('/controle/{id?}', ['uses' => 'ContatoController@editar']);
//Rota 
Route::get('/admin/cadastro', ['as' => 'admin.cadastra', 'uses' => 'Admin\CadastroController@index']);
Route::get('/admin/cadastro/adicionar', ['as' => 'admin.adiciona', 'uses' => 'Admin\CadastroController@add']);
Route::post('/admin/cadastro/salvar', ['as' => 'admin.salva', 'uses' => 'Admin\CadastroController@save']);
Route::get('/admin/cadastro/editar/{id}', ['as' => 'admin.edita', 'uses' => 'Admin\CadastroController@edit']);
Route::get('/admin/cadastro/atualizar/{id}', ['as' => 'admin.atualiza', 'uses' => 'Admin\CadastroController@update']);
Route::get('/admin/cadastro/deletar/{id}', ['as' => 'admin.deleta', 'uses' => 'Admin\CadastroController@delete']);
