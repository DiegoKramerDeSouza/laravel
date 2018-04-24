<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Salas de aula')

<!--Define yield('content') em layout.site-->
@section('content')
    <div id='initial-access' class='row card z-depth-5'>
        <div class='card-content'>
            <div id='opend-rooms' class='col s12 m6'>
                <h5 class='row'>
                    <span class='col s8'>Salas disponíveis</span>
                    <span class='col s4' align='right'></span>
                </h5>
                <div class='divider'></div>
                <div id='public-conference' align='center'>
                    <div class="center blue-text">
                        <h5>Encontrando salas...</h5>
                        <a class="btn-floating btn-large cyan pulse"><i class="material-icons">search</i></a>
                    </div>
                    <!--Salas disponíveis-->
                </div>
            </div>
            <!--Acesso para criação de sala-->
            <div id='teacher-access' class='col s12 m6'>
                <div class='card-title blue-text'>
                    <h5><i class='fa fa-desktop'></i> Criar sala de aula</h5>
                </div>
                <div class='row'>
                    <!--Formulário de criação de salas-->
                    <form id='criar-sala' action='#' method='post'>
                        {{ csrf_field() }}
                        <!--Assunto da aula (Obrigatório)-->
                        <div class='input-field col s12'>
                            <input type='text' class='validate' id='materia' name='materia' required>
                            <label for='materia'><i class='fa fa-book'></i> Assunto da Aula:</label>
                        </div>

                        <input type='hidden' class='validate' id='escola' name='escola' required value='{{ isset($school->school_id) ? $school->school_id . "|" . $escolas->name : ''}}'>
                        
                        <div class='input-field col s12'>
                            <!--Select de turmas (Obrigatório)-->
                            <select id='turma' required name='turma'>
                                <option value="" disabled selected>Selecione</option>
                                @if(isset($turmas))
                                    @foreach($turmas as $turma)
                                        <option value="{{ $turma->id . '|' . $turma->name }}">{{ $turma->name }}</option>
                                    @endforeach
                                @endif
                            </select>
                            <label for='turma'><i class='fa fa-graduation-cap'></i> Turma</label>
                        </div>
                        <div class='divider'></div>
                        <div align='right'>
                            <!--Submit-->
                            <button type='submit' id='btn-join-as-teacher' disabled class='btn blue white-text waves-effect waves-light'><i class='fa fa-desktop'></i> Criar Sala</button>
                        </div>
                        <input type='hidden' id='room-id' />
                    </form>
                </div> 
            </div>
            <input type='hidden' id='codEscola' value='{{ $school->school_id}}' />
            <input type='hidden' id='meuNome' value='{{Auth::user()->name}}' />
        </div>
    </div>
    <!--Video Panel-->
    <div id='video-panel' class='d-none'>
        <!--Painel de Debug-->
        <div class='hidden-panel'>
            <input type='hidden' id='connected-class' readonly />
            <input type='hidden' id='connected-content' readonly />
            <input type='hidden' id='current-user' value='{{ Auth::user()->name}}' readonly />
        </div>
        <div class='col s12'>
            <!--Card de vídeo e chat-->
            <div class='card'>
                <div class='card-content'>
                    <div id='class-suptitle'>
                        <i class="fa fa-circle light-green-text text-accent-4"></i>
                        <span id='class-title'>
                            <!--Título da aula - Matéria (Assunto)-->
                        </span>
                    </div>
                    <div class='row'>
                        <div class='col s12'>
                            <div id='room-urls'>
                                <!--Definições da Sala-->
                            </div>
                            <div id='main-video' class='inroom mainView'>
                                <!--VÍDEO PRINCIPAL-->
                                <div id='div-connect'>
                                    <div align='center'>
                                        <h6 class='blue-text'>Conectando...</h6>
                                    </div>
                                    <div class="progress">
                                        <div class="indeterminate"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id='teacher-name' class='card-action' align='center'>
                    <h5><span id='prof-room-name'></span></h5>
                </div>
            </div>
        </div>
        <!--Painel com os vídeos dos espectadores-->
        <div id='second-video' class='col s12 m4 incoming-videos'>
            <div id='class-video' class='inroom otherView'>
                <!--Outros vídeos-->
            </div>
        </div>
    </div> 
@endsection