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
                    <h5 class='row'>
                        <span><b><i class='fa fa-television'></i> Salas disponíveis</b></span>
                    </h5>
            @else
                <div id='opend-rooms' class='col s12'>
                    <h4 class='row'>
                        <span><i class='fa fa-television'></i> <b>Bem vindo(a) <span class='blue-text'>{{ Auth::user()->name }}</span></b></span>
                    </h4>
                    <h5 class='row'>
                        <span><b>Estas são as salas disponíveis para você:</b></span>
                    </h5>
            @endif
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
    <!-- ID da sala e tela-->
    <input type='hidden' id='in-room' name='in-room' disabled readonly />
    <input type='hidden' id='in-screen' name='in-screen' disabled readonly />
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
                        <div id='broadcast-viewers-counter' data-target='{{ Auth::user()->type  }}' class='blue-text' >
                            <br>
                        </div>
                    </div>
                    <div class='divider'></div>
                    <br>
                    <div class='row'>
                        <div class='col s12'>
                            <div id='main-video' align='center' class='inroom mainView'>
                                <!--Div de loading de conteúdo (Apenas demonstrativa)-->
                                <div id='div-connect'>
                                    <div align='center' style='margin-top:50px;'>
                                        <h6 class='blue-text'>Conectando...</h6>
                                    </div>
                                    <div class="progress grey lighten-3">
                                        <div class="indeterminate blue"></div>
                                    </div>
                                </div>
                                <div id='videos'>
                                    <!--VÍDEO PRINCIPAL-->
                                    <div id='span-video-preview' data-status='disabled' data-position='main' class='width-limit first-video'>
                                        <video id="video-preview" class="responsive-video" preload="none" loop ></video>
                                        <div id='div-exit-fullscreen' class='fixed-action-btn d-none'>
                                            <a id='exit-fullscreen' class='btn-floating btn-large blue darken-2'>
                                                <i class='material-icons large'>fullscreen_exit</i>
                                            </a>
                                        </div>
                                        
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--Painel com os vídeos dos espectadores-->
        <div id='line-video' class='col s12 m4 incoming-videos'>
            <div id='class-video' class='inroom otherView'>
                <!--Outros vídeos-->
            </div>
        </div>
        <!--VÍDEO SECUNDÁRIO-->
        <div id='span-video-preview-2nd' data-status='disabled' data-position='second' class='d-none second-video'>
            <video id="secondvideo-preview" preload="none" loop class='min-video responsive-video'></video>
            <a id='swap-video' style='bottom:10px;' class='btn-floating halfway-fab blue darken-2 waves-effect waves-light'>
                <i class='material-icons'>swap_horiz</i>
            </a>
        </div> 
    </div>
    <!-- Sidebar de painel de chat -->
    <ul id="slide-out" class="sidenav grey lighten-4 z-depth-5">
        <div class='row'>
            <div id='chat-textarea' class=''>
                <div id='chat-panel' class='white-text'>
                    <!--Output de mensagem-->
                </div>
            </div>
            <div class='divider'></div>
            <div class='file-field input-field' style='padding:5px;'>
                <a id='send-message-btn' class='btn-floating waves-effect waves-light blue right'>
                    <i class='material-icons'>send</i>
                </a>
                <div class='file-path-wrapper'>
                    <!--Input de mensagem-->
                    <i class='fa fa-commenting-o fa-1x prefix'></i>
                    <input type='text' class='' id='text-message' placeholder='Chat'>
                </div>
            </div>
        </div>
    </ul>
    @if(isset($streamPage))
        <!-- Modal de conexões ativas-->
        <div id='con-list' class='modal'>
            <div class='modal-content'>
                <h5>
                    <i class='material-icons blue-text'>ondemand_video</i> Espectadores:
                    <span class='right'>
                        <a class='modal-close'>
                            <i class='fa fa-times red-text text-darken-3'></i>
                        </a>
                    </span>
                </h5>
                <div class='divider'></div>
                <ul id='connection-list' class='collection'>
                </ul>
                <br>
            </div>
        </div>

        @if(Auth::user()->type == 0)
            <!-- Modal de solicitação de vez-->
            <div id='msg-solicita' class='modal'>
                <div class='modal-content'>
                    <h5>
                        <i class='material-icons blue-text'>pan_tool</i> Solicitações:
                        <span class='right'>
                            <a class='modal-close'>
                                <i class='fa fa-times red-text text-darken-3'></i>
                            </a>
                        </span>
                    </h5>
                    <div class='divider'></div>
                    <ul id='solicita-list' class='collection'>
                    </ul>
                    <br>
                </div>
            </div>

            <!-- Modal de compartilhamento-->
            <div id='msg-share' class='modal'>
                <div class='modal-content'>
                    <h5>
                        <i class='material-icons blue-text'>extension</i> Extensão do Chrome:
                        <span class='right'>
                            <a class='modal-close'>
                                <i class='fa fa-times red-text text-darken-3'></i>
                            </a>
                        </span>
                    </h5>
                    <div class='divider'></div>
                    <div class='red-text text-darken-3'>
                        <p>Para compartilhar sua tela, seu navegador deve possuir a extensão do {{ $logo }}.</p>
                        <p><b>Deseja instalar a extensão do {{ $logo }} para o navegador Google Chrome?</b></p>
                    </div>
                    <br>
                </div>
                <div class='modal-action'>
                    <a href='https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk' target='_blank' onclick='chrome.webstore.install()' class='right btn-flat blue-text text-darken-2 waves-effect waves-teal'><i class='fa fa-check'></i> sim, instalar</a>
                    <a class='modal-close right btn-flat red-text text-darken-3 waves-effect waves-red'><i class='fa fa-times'></i> não</a>
                </div>
            </div>
        @endif

        <div id='div-enter' class='fixed-action-btn d-none tooltipped' data-position='left' data-tooltip='Ingressar' style='margin-bottom: 62px;'>
            <a id='enter' class='btn-floating btn-large waves-effect waves-light cyan pulse'>
                <i class='large material-icons'>videocam</i>
            </a>
        </div>
        <div id='control-toggle' class='fixed-action-btn d-none'>
            <a id='enter' class='btn-floating btn-large waves-effect waves-light blue darken-3 tooltipped' data-position='left' data-tooltip='Controles'>
                <i class='large material-icons'>dvr</i>
            </a>
        </div>
    @endif
@endsection