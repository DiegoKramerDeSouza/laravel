<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Salas de aula')

<!--Define yield('content') em layout.site-->
@section('content')
    <div id='initial-access' class='row'>
        <div class='white-text'>
            @if(Auth::user()->type == 0)
                <div id='opend-rooms' class='col s12 m6'>
            @else
                <div id='opend-rooms' class='col s12'>
            @endif
                <h5 class='row'>
                    <span><b><i class='fa fa-television'></i> Salas disponíveis</b></span>
                </h5>
                <div class='divider'></div>
                <div id='public-conference' align='center'>
                    <div class="center blue-text text-darken-2">
                        <h5>Encontrando salas...</h5>
                        <a class="btn-floating btn-large cyan pulse"><i class="material-icons">search</i></a>
                    </div>
                    <!--Salas disponíveis-->
                </div>
            </div>
            <!--Acesso para criação de sala-->
            @if(Auth::user()->type == 0)
                <div id='teacher-access' class='card z-depth-5 col s12 m6'>
                    <div class='card-content'>
                        <div class='card-title black-text'>
                            <h5><i class='fa fa-plus-circle blue-text'></i> Iniciar nova sala</h5>
                        </div>
                        <div class='row'>
                            <!--Formulário de criação de salas-->
                            <form id='criar-sala' action='#' method='post'>
                                {{ csrf_field() }}
                                <!--Assunto da aula (Obrigatório)-->
                                <div class='input-field col s12'>
                                    <input type='text' class='validate' id='materia' name='materia' required>
                                    <label for='materia'><i class='fa fa-book'></i> Matéria da Aula:</label>
                                </div>
                                <div class='input-field col s12'>
                                    <input type='text' class='validate' id='assunto' name='assunto' required>
                                    <label for='assunto'><i class='fa fa-tags'></i> Assunto da Aula:</label>
                                </div>

                                <input type='hidden' class='validate' id='escola' name='escola' readonly value=''>
                                
                                <div class='input-field col s12'>
                                    <!--Select de turmas (Obrigatório)-->
                                    <select multiple id='turma' required name='turma'>
                                        @if(isset($escolas))
                                            @foreach($escolas as $escola)
                                                <optgroup label="Instituição: {{ $escola->name }}">
                                                    @foreach($turmas as $turma)
                                                        @if($turma->school_id == $escola->id)
                                                            <option value="{{ $escola->id . '|' . $escola->name . '|' . $turma->id . '|' . $turma->name }}">{{ $escola->name }} - {{ $turma->name }}</option>
                                                        @endif
                                                    @endforeach
                                                </optgroup>
                                            @endforeach
                                        @endif
                                    </select>
                                    <label for='turma'><i class='fa fa-graduation-cap'></i> Seleção de turmas</label>
                                </div>
                                
                                <div class='divider'></div>
                                <div align='right'>
                                    <!--Submit-->
                                    <button type='submit' id='btn-join-as-productor' class='btn blue white-text waves-effect waves-light'><i class='fa fa-check'></i> Criar</button>
                                </div>
                                <input type='hidden' readonly id='room-id' />
                            </form>
                        </div> 
                    </div>
                    <input type='hidden' id='codEscola' readonly value='{{ $userdado->school_id}}' />
                    <input type='hidden' id='meuNome' readonly value='{{Auth::user()->name}}' />
                </div>
            @endif
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