<?php

namespace App\Http\Controllers\Admin;

use Validator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\EspecialMethods;
use App\Curso;
use App\Modulo;

class CadastroCursoController extends Controller
{
    use EspecialMethods;
    
    public function __construct()
    {
        $this->pagination = $this->setDefaults()->pagination;
        $this->module = 'Curso';
    }

    /**
     * Validação de permissão de acesso;
     * Coleta todos os cursos por nome;
     * Coleta todos os modulos por nome;
     * Direciona para a View de Listagem de turmas;
     */
    public function index(Request $req){

        if($this->validade($this->module)){
            $resultado = Curso::orderBy('name', 'asc')->paginate($this->pagination);
            $allmodulos = Modulo::all()->toArray();
            $modulos = array();
            foreach($allmodulos as $modulo) $modulos[$modulo['id']] = $modulo['name'];
            $isAutocomplete = true;
            if(isset($req->success)) {
                $success = $this->returnMessages($req, $this->module);
                return view('admin.cadastro.cursos.index', compact('resultado', 'modulos', 'isAutocomplete', 'success'));
            }
            return view('admin.cadastro.cursos.index', compact('resultado', 'modulos', 'isAutocomplete'));
        }
        return $this->accessDenied();
    }

    /**
     * Validação de permissão de acesso;
     * Coleta os todos os cursos e modulos;
     * Direciona para View de novo Cadastro;
     */
    public function add(){

        if($this->validade($this->module)){
            $resultado = Curso::all();
            $modulos = Modulo::all();
            return view('admin.cadastro.cursos.adicionar', compact('resultado', 'modulos'));
        } 
        return $this->accessDenied();
    }

    /**
     * 1. Validação de permissão de acesso;
     * 2. Validação dos campos a gravar;
     * 3. Define os campos enviados que devem ser gravados em Cursos;
     * 4. Insere na base de dados Cursos;
     */
    public function save(Request $req){

        if($this->validade($this->module)){
            $validator = Validator::make($req->all(), [
                'name' => 'bail|required|unique:cursos|min:4|max:191',
                'modulo_id' => 'required'
            ]);
            if ($validator->fails()) {
                return redirect()->route('admin.cadastro.cursos.adiciona')
                            ->withErrors($validator)
                            ->withInput();
            }
            $cursos = [
                '_token'=>$req->_token,
                'name'=>$req->name,
                'modulo_id'=>$req->modulo_id
            ];
            Curso::create($cursos);

            return redirect()->route('admin.cadastro.cursos', ['success' => '1']);
        }
        return $this->accessDenied();
    }

    /**
     * 1. Validação de permissão de acesso;
     * 2. Coleta todos os cursos e modulos;
     * 3. Direciona para View de edição;
     */ 
    public function edit($id){

        if($this->validade($this->module)){
            $resultado = Curso::find($id);
            $modulos = Modulo::all();
            return view('admin.cadastro.cursos.editar', compact('resultado', 'modulos'));
        }
        return $this->accessDenied();
    }

    /**
     * 1. Validação de permissão de acesso;
     * 2. Validação dos campos a alterar;
     * 3. Define os campos enviados que devem ser atualizados em Cursos;
     * 4. Atualiza base de dados Cursos;
     */
    public function update(Request $req, $id){

        if($this->validade($this->module)){
            $validator = Validator::make($req->all(), [
                'name' => 'bail|required|unique:cursos,name,' . $id . '|min:4|max:191',
                'modulo_id' => 'required'
            ]);
            if ($validator->fails()) {
                return redirect()->route('admin.cadastro.cursos.edita', $id)
                            ->withErrors($validator)
                            ->withInput();
            }
            $cursos = [
                '_token'=>$req->_token,
                'name'=>$req->name,
                'modulo_id'=>$req->modulo_id
            ];
            Curso::find($id)->update($cursos);

            return redirect()->route('admin.cadastro.cursos', ['success' => '2']);
        } 
        return $this->accessDenied();
    }

    /**
     * Validação de permissão de acesso;
     * Deleta ID informado na base Cursos;
     */
    public function delete($id){

        if($this->validade($this->module)){
            Curso::find($id)->delete();
            return redirect()->route('admin.cadastro.cursos', ['success' => '3']);
        }
        return $this->accessDenied();
    }
}
