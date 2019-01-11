<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DefaultMessages extends Model
{
    //
    public function __construct(){

        // Mensagens de erro
        $this->accessDenied =           "Acesso Negado!";
        $this->userPasswordIncorrect =  "Usuário ou senha incorretos!";
        // Mensagens de sucesso
        $this->created = [
            'User' => "Usuário criado com sucesso!",
            'Curso' => "Curso criado com sucesso!",
            'Modulo' => "Módulo criado com sucesso!",
            'Turma' => "Turma criada com sucesso!",
            'Perfil' => "Perfil criado com sucesso!",
            'Escola' => "Instituição criada com sucesso!"
        ];
        $this->updated = [
            'User' => "Usuário atualizado com sucesso!",
            'Curso' => "Curso atualizado com sucesso!",
            'Modulo' => "Módulo atualizado com sucesso!",
            'Turma' => "Turma atualizada com sucesso!",
            'Perfil' => "Perfil atualizado com sucesso!",
            'Escola' => "Instituição atualizada com sucesso!"
        ];
        $this->deleted = [
            'User' => "Usuário excluído com sucesso!",
            'Curso' => "Curso excluído com sucesso!",
            'Modulo' => "Módulo excluído com sucesso!",
            'Turma' => "Turma excluída com sucesso!",
            'Perfil' => "Perfil excluído com sucesso!",
            'Escola' => "Instituição excluída com sucesso!"
        ];

    }
}
