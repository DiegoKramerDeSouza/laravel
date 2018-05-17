<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Salas de aula')

<!--Define yield('content') em layout.site-->
@section('content')
    <div id='initial-access' class='row'>
        <div class='white-text'>
            <!--Diferenciação por tipo de usuário (Espectador/Agente)-->
            @if(Auth::user()->type == 0)
                <div id='opend-rooms' class='col s12 m6'>
            @else
                <div id='opend-rooms' class='col s12'>
            @endif
                <h5 class='row'>
                    <span><b><i class='fa fa-television'></i> Salas disponíveis</b></span>
                </h5>
                <div class='divider'></div>
                <div id='public-conference'>
                    <!--Div de loading de conteúdo. Apenas demonstrativa-->
                    <div class="center blue-text text-darken-2" align='center'>
                        <h5>Encontrando salas...</h5>
                        <a class="btn-floating btn-large blue pulse"><i class="material-icons">search</i></a>
                    </div>
                    
                    <!--Listagem de Salas disponíveis-->

                </div>
            </div>
            <!--Acesso para criação de sala: Apenas para usuários do tipo 0 (Agente)-->
            @if(Auth::user()->type == 0)
                <div id='teacher-access' class='card z-depth-5 col s12 m6'>
                    <div class='card-content'>
                        <div class='card-title black-text'>
                            <h5><i class='fa fa-plus-circle blue-text'></i> Iniciar nova sala</h5>
                        </div>
                        <div class='row'>
                            <!--Formulário de criação de salas-->
                            <!--Form removido para utilização com firefox-->
                            <!--Tema e Assunto da aula (Obrigatórios)-->
                            <div class='input-field col s12'>
                                <input type='text' class='validate' id='tema' name='tema' required autofocus>
                                <label for='tema'><i class='fa fa-book'></i> Tema:</label>
                            </div>
                            <div class='input-field col s12'>
                                <input type='text' class='validate' id='assunto' name='assunto' required>
                                <label for='assunto'><i class='fa fa-bookmark'></i> Assunto:</label>
                            </div>
                            <div class='input-field col s12'>
                                <!--Select de Cursos (Obrigatório)-->
                                <select multiple id='cursos-list' required name='cursos-list' title='Selecione ao menos um curso'>
                                    @if(isset($cursos))
                                        <option value='' disabled>Selecione ao menos um curso</option>
                                        @foreach($cursos as $curso)
                                            <option value="{{ $curso->id }}">{{ $modulos[$curso->modulo_id] }} {{ $curso->name }}</option>
                                        @endforeach
                                    @endif
                                </select>
                                <label for='cursos-list'><i class='fa fa-cubes'></i> Seleção de Cursos</label>
                            </div>
                            
                            <div class='divider'></div>
                            <div align='right'>
                                <!--Submit-->
                                <button type='submit' id='btn-join-as-productor' class='btn blue white-text waves-effect waves-light'><i class='fa fa-play'></i> Iniciar</button>
                            </div>
                        </div> 
                    </div>
                </div>
                <input type='hidden' id='target' name='target' disabled readonly />
            @else
                <input type='hidden' id='btn-join-as-productor' readonly disabled />
                <input type='hidden' id='target' name='target' readonly disabled value='{{ $turmas->curso_id }}' />
            @endif
        </div>
    </div>

    <!--Campos de controle-->
<input type='hidden' id='room-id' name='room-id' value='{{ Auth::user()->login}}-{{ Auth::user()->name}}-{!! rand(0,999) !!}' disabled readonly />
    <!-- ID do broadcaster-->
    <input type='hidden' id='broadcaster' name='broadcaster' disabled readonly />
    <!-- ID da sala-->
    <input type='hidden' id='in-room' name='in-room' disabled readonly />
    <!-- Usuário-->
    <input type='hidden' id='current-user' value='{{ Auth::user()->name}}' disabled readonly />

    <!--Video Panel - Não exibido a princípio-->
    <div id='video-panel' class='d-none'>
        <div class='col s12'>
            <!--Card de vídeo-->
            <div class='card'>
                <div class='card-content'>
                    <div id='class-suptitle'>
                        <span id='class-title' class='card-title'>
                            <!--Título da aula - Matéria (Assunto)-->
                        </span>
                        @if(Auth::user()->type == 0)
                            <div id='broadcast-viewers-counter' class='blue-text' >
                                <br>
                            </div>
                        @endif
                    </div>
                    <div class='divider'></div>
                    <br>
                    <div class='row'>
                        <div class='col s12'>
                            <div id='main-video' align='center' class='inroom mainView'>
                                <!--Div de loading de conteúdo. Apenas demonstrativa-->
                                <div id='div-connect'>
                                    <div align='center' style='margin-top:50px;'>
                                        <h6 class='blue-text'>Conectando...</h6>
                                    </div>
                                    <div class="progress grey lighten-3">
                                        <div class="indeterminate blue"></div>
                                    </div>
                                </div>
                                
                                <!--VÍDEO PRINCIPAL-->
                                <div id='span-video-preview' data-status='disabled' class='width-limit'>
                                    <video id="video-preview" loop></video>
                                    <div id='div-exit-fullscreen' class='fixed-action-btn d-none'>
                                        <a id='exit-fullscreen' class='btn-floating btn-large blue darken-2'>
                                            <i class='material-icons large'>fullscreen_exit</i>
                                        </a>
                                    </div>
                                </div> 

                                <!--VÍDEO SECUNDÁRIO-->

                            </div>
                        </div>
                    </div>
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