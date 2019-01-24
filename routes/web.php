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

/*
 *  Rotas de validação do status da aplicação
 */
if(env('APP_ENV') == 'offline') {
    Route::get('/', ['as' => 'home', 'uses' => 'Site\OfflineController@index']);
    Route::get('/login', ['as' => 'login', 'uses' => 'Site\OfflineController@index']);
} else {
    Route::get('/', ['as' => 'home', 'uses' => 'Site\HomeController@index']);
    Route::get('/login', ['as' => 'login', 'uses' => 'Site\LoginController@index']);
}

/**
 * Rotas de acesso ao sistema
 */
Route::post('/login/access', ['as' => 'login.access', 'uses' => 'Site\LoginController@access']);
Route::get('/login/destroy', ['as' => 'login.destroy', 'uses' => 'Site\LoginController@logout']);

/**
 *  Rota de verificação do plugin de compartilhamento de tela
 */
Route::get('/getSourceId', function() {
    return File::get(public_path() . '/html/getScreenId.html');
});


/**
 *  Rota para Rest de turmas e registro de presença
 */
Route::post('/rest/chamada', ['as' => 'chamada', 'uses' => 'Site\RestController@index']);
Route::get('/rest/listaTurmas', ['as' => 'listaTurmas', 'uses' => 'Site\RestController@listaTurmas']);
Route::post('/rest/listaPresenca', ['as' => 'listaPresenca', 'uses' => 'Site\RestController@listaPresenca']);
Route::post('/rest/confirmaPresenca', ['as' => 'confirmaPresenca', 'uses' => 'Site\RestController@confirmaPresenca']);
Route::post('/rest/testaPresenca', ['as' => 'testaPresenca', 'uses' => 'Site\RestController@testaPresenca']);
Route::post('/rest/testaPhoto', ['as' => 'testaPhoto', 'uses' => 'Site\RestController@testaReceivePhoto']);

Route::post('/rest/listaCursos', ['as' => 'listaCursos', 'uses' => 'Site\RestController@listaDadosDeUsuarios']);
Route::get('/rest/checaSessao', ['as' => 'checaSessao', 'uses' => 'Site\RestController@checkSession']);

/**
 * Grupo de rotas pós autenticação
 */
Route::group(['middleware' => 'auth'], function(){
    /**
     *  Rota de acesso negado
     */
    Route::get('/denied', ['as' => 'denied', 'uses' => 'Site\AccessController@index']);

    /**
     *  Rota de Salas/CRUD de Salas
     */
    Route::get('/salas', ['as' => 'salas', 'uses' => 'Site\RoomController@index']);
    Route::post('/rest/salas/salvar', ['as' => 'salas.salva', 'uses' => 'Site\RoomController@save']);
    Route::post('/rest/salas/update', ['as' => 'salas.update', 'uses' => 'Site\RoomController@update']);    

    /**
     *  Rota de CRUD dos recursos gerenciáveis do sistema
     */

    //Rotas para o formulário de cadastro de usuários e instituições
    Route::get('/admin/cadastro', ['as' => 'admin.cadastro', 'uses' => 'Admin\CadastroController@index']);

    //Rotas para o formulário de cadastro de usuários
    Route::get('/admin/cadastro/usuarios/', ['as' => 'admin.cadastro.usuarios', 'uses' => 'Admin\CadastroUsuarioController@index']);
    Route::get('/admin/cadastro/usuarios/adicionar', ['as' => 'admin.cadastro.usuarios.adiciona', 'uses' => 'Admin\CadastroUsuarioController@add']);
    Route::post('/admin/cadastro/usuarios/salvar', ['as' => 'admin.cadastro.usuarios.salva', 'uses' => 'Admin\CadastroUsuarioController@save']);
    Route::get('/admin/cadastro/usuarios/editar/{id}', ['as' => 'admin.cadastro.usuarios.edita', 'uses' => 'Admin\CadastroUsuarioController@edit']);
    Route::put('/admin/cadastro/usuarios/atualizar/{id}', ['as' => 'admin.cadastro.usuarios.atualiza', 'uses' => 'Admin\CadastroUsuarioController@update']);
    Route::get('/admin/cadastro/usuarios/deletar/{id}', ['as' => 'admin.cadastro.usuarios.deleta', 'uses' => 'Admin\CadastroUsuarioController@delete']);

    //Rotas para o formulário de cadastro de perfis
    Route::get('/admin/cadastro/perfis/', ['as' => 'admin.cadastro.perfis', 'uses' => 'Admin\CadastroPerfilController@index']);
    Route::get('/admin/cadastro/perfis/adicionar', ['as' => 'admin.cadastro.perfis.adiciona', 'uses' => 'Admin\CadastroPerfilController@add']);
    Route::post('/admin/cadastro/perfis/salvar', ['as' => 'admin.cadastro.perfis.salva', 'uses' => 'Admin\CadastroPerfilController@save']);
    Route::get('/admin/cadastro/perfis/editar/{id}', ['as' => 'admin.cadastro.perfis.edita', 'uses' => 'Admin\CadastroPerfilController@edit']);
    Route::put('/admin/cadastro/perfis/atualizar/{id}', ['as' => 'admin.cadastro.perfis.atualiza', 'uses' => 'Admin\CadastroPerfilController@update']);
    Route::get('/admin/cadastro/perfis/deletar/{id}', ['as' => 'admin.cadastro.perfis.deleta', 'uses' => 'Admin\CadastroPerfilController@delete']);

    //Rotas para o formulário de cadastro de modulos
    Route::get('/admin/cadastro/modulos/', ['as' => 'admin.cadastro.modulos', 'uses' => 'Admin\CadastroModuloController@index']);
    Route::get('/admin/cadastro/modulos/adicionar', ['as' => 'admin.cadastro.modulos.adiciona', 'uses' => 'Admin\CadastroModuloController@add']);
    Route::post('/admin/cadastro/modulos/salvar', ['as' => 'admin.cadastro.modulos.salva', 'uses' => 'Admin\CadastroModuloController@save']);
    Route::get('/admin/cadastro/modulos/editar/{id}', ['as' => 'admin.cadastro.modulos.edita', 'uses' => 'Admin\CadastroModuloController@edit']);
    Route::put('/admin/cadastro/modulos/atualizar/{id}', ['as' => 'admin.cadastro.modulos.atualiza', 'uses' => 'Admin\CadastroModuloController@update']);
    Route::get('/admin/cadastro/modulos/deletar/{id}', ['as' => 'admin.cadastro.modulos.deleta', 'uses' => 'Admin\CadastroModuloController@delete']);

    //Rotas para o formulário de cadastro de cursos
    Route::get('/admin/cadastro/cursos/', ['as' => 'admin.cadastro.cursos', 'uses' => 'Admin\CadastroCursoController@index']);
    Route::get('/admin/cadastro/cursos/adicionar', ['as' => 'admin.cadastro.cursos.adiciona', 'uses' => 'Admin\CadastroCursoController@add']);
    Route::post('/admin/cadastro/cursos/salvar', ['as' => 'admin.cadastro.cursos.salva', 'uses' => 'Admin\CadastroCursoController@save']);
    Route::get('/admin/cadastro/cursos/editar/{id}', ['as' => 'admin.cadastro.cursos.edita', 'uses' => 'Admin\CadastroCursoController@edit']);
    Route::put('/admin/cadastro/cursos/atualizar/{id}', ['as' => 'admin.cadastro.cursos.atualiza', 'uses' => 'Admin\CadastroCursoController@update']);
    Route::get('/admin/cadastro/cursos/deletar/{id}', ['as' => 'admin.cadastro.cursos.deleta', 'uses' => 'Admin\CadastroCursoController@delete']);

    //Rotas para o formulário de cadastro de turmas
    Route::get('/admin/cadastro/turmas/', ['as' => 'admin.cadastro.turmas', 'uses' => 'Admin\CadastroTurmaController@index']);
    Route::get('/admin/cadastro/turmas/adicionar', ['as' => 'admin.cadastro.turmas.adiciona', 'uses' => 'Admin\CadastroTurmaController@add']);
    Route::post('/admin/cadastro/turmas/salvar', ['as' => 'admin.cadastro.turmas.salva', 'uses' => 'Admin\CadastroTurmaController@save']);
    Route::get('/admin/cadastro/turmas/editar/{id}', ['as' => 'admin.cadastro.turmas.edita', 'uses' => 'Admin\CadastroTurmaController@edit']);
    Route::put('/admin/cadastro/turmas/atualizar/{id}', ['as' => 'admin.cadastro.turmas.atualiza', 'uses' => 'Admin\CadastroTurmaController@update']);
    Route::get('/admin/cadastro/turmas/deletar/{id}', ['as' => 'admin.cadastro.turmas.deleta', 'uses' => 'Admin\CadastroTurmaController@delete']);

    //Rotas para o formulário de cadastro de escolas
    Route::get('/admin/cadastro/escolas/', ['as' => 'admin.cadastro.escolas', 'uses' => 'Admin\CadastroEscolaController@index']);
    Route::get('/admin/cadastro/escolas/adicionar', ['as' => 'admin.cadastro.escolas.adiciona', 'uses' => 'Admin\CadastroEscolaController@add']);
    Route::post('/admin/cadastro/escolas/salvar', ['as' => 'admin.cadastro.escolas.salva', 'uses' => 'Admin\CadastroEscolaController@save']);
    Route::get('/admin/cadastro/escolas/editar/{id}', ['as' => 'admin.cadastro.escolas.edita', 'uses' => 'Admin\CadastroEscolaController@edit']);
    Route::put('/admin/cadastro/escolas/atualizar/{id}', ['as' => 'admin.cadastro.escolas.atualiza', 'uses' => 'Admin\CadastroEscolaController@update']);
    Route::get('/admin/cadastro/escolas/deletar/{id}', ['as' => 'admin.cadastro.escolas.deleta', 'uses' => 'Admin\CadastroEscolaController@delete']);
    
    //Rota para resolução do autocomplete
    Route::get('/admin/cadastro/{module}/autocomplete/', ['as' => 'admin.cadastro.autocomplete', 'uses' => 'Admin\CadastroAutocompleteController@autocomplete']);
    Route::get('/admin/cadastro/{module}/result/{name}', ['as' => 'admin.cadastro.autocomplete.result', 'uses' => 'Admin\CadastroAutocompleteController@resultAutocomplete']);

});
