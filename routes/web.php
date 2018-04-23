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
    return view('home');
});

//Rota para página inicial
Route::get('/', ['as' => 'home', 'uses' => 'Site\HomeController@index']);

//Encaminhamentos para o Controller ContatoController > app/Http/Controllers/ContatoController
//Rota de teste - index
Route::get('/salas/{id?}', ['as' => 'salas', 'uses' => 'ContatoController@index']);
//Rota de teste - criar
Route::post('/controle/{id?}', ['uses' => 'ContatoController@criar']);
//Rota de teste - editar
Route::put('/controle/{id?}', ['uses' => 'ContatoController@editar']);

//Rotas para o formulário de cadastro de usuários e instituições
Route::get('/admin/cadastro', ['as' => 'admin.cadastro', 'uses' => 'Admin\CadastroController@index']);

//Rotas para o formulário de cadastro de usuários
Route::get('/admin/cadastro/usuarios', ['as' => 'admin.cadastro.usuarios', 'uses' => 'Admin\CadastroUsuarioController@index']);
Route::get('/admin/cadastro/usuarios/adicionar', ['as' => 'admin.cadastro.usuarios.adiciona', 'uses' => 'Admin\CadastroUsuarioController@add']);
Route::post('/admin/cadastro/usuarios/salvar', ['as' => 'admin.cadastro.usuarios.salva', 'uses' => 'Admin\CadastroUsuarioController@save']);
Route::get('/admin/cadastro/usuarios/editar/{id}', ['as' => 'admin.cadastro.usuarios.edita', 'uses' => 'Admin\CadastroUsuarioController@edit']);
Route::put('/admin/cadastro/usuarios/atualizar/{id}', ['as' => 'admin.cadastro.usuarios.atualiza', 'uses' => 'Admin\CadastroUsuarioController@update']);
Route::get('/admin/cadastro/usuarios/deletar/{id}', ['as' => 'admin.cadastro.usuarios.deleta', 'uses' => 'Admin\CadastroUsuarioController@delete']);

//Rotas para o formulário de cadastro de escolas
Route::get('/admin/cadastro/escolas', ['as' => 'admin.cadastro.escolas', 'uses' => 'Admin\CadastroEscolaController@index']);
Route::get('/admin/cadastro/escolas/adicionar', ['as' => 'admin.cadastro.escolas.adiciona', 'uses' => 'Admin\CadastroEscolaController@add']);
Route::post('/admin/cadastro/escolas/salvar', ['as' => 'admin.cadastro.escolas.salva', 'uses' => 'Admin\CadastroEscolaController@save']);
Route::get('/admin/cadastro/escolas/editar/{id}', ['as' => 'admin.cadastro.escolas.edita', 'uses' => 'Admin\CadastroEscolaController@edit']);
Route::put('/admin/cadastro/escolas/atualizar/{id}', ['as' => 'admin.cadastro.escolas.atualiza', 'uses' => 'Admin\CadastroEscolaController@update']);
Route::get('/admin/cadastro/escolas/deletar/{id}', ['as' => 'admin.cadastro.escolas.deleta', 'uses' => 'Admin\CadastroEscolaController@delete']);

//Rota de teste para colleta de dados a prtir de cep
Route::get('/admin/cadastro/escolas/coletar/{cep?}', ['as' => 'admin.cadastro.escolas.coleta', 'uses' => 'Admin\CadastroEscolaController@collect']);
