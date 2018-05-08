        
            </div>
        </main>
        <!-- Inicialização do Javascript no fim do corpo da página-->
        <script type="text/javascript" src="{!! asset('js/jquery-3.1.1.min.js') !!}"></script>
        <script type="text/javascript" src="{!! asset('js/materialize.min.js') !!}"></script>

        <!-- Inicialização in-page condicional de elementos para a formação de uma sala-->
        <!-- A variável $streamPage deve ser passada pelo controller para inicialização-->
        @if(isset($streamPage))
            <!-- Adição dos scripts de utilização do WEBRTC-->
            <script type="text/javascript" src="{!! asset('js/webrtc/socket.io.js') !!}"></script>
            <script type="text/javascript" src="{!! asset('js/webrtc/getHTMLMediaElement.js') !!}"></script>
            <script type="text/javascript" src="{!! asset('js/webrtc/RTCMultiConnection.min.js') !!}"></script>
            <script type="text/javascript" src="{!! asset('js/webrtc/application.js') !!}"></script>
            <script>
                // Controle da inicialização do MaterializeCSS para textarea
                $(document).ready(function(){
                    M.textareaAutoResize($('#chat-panel'));
                });
            </script>

            <!-- Controle de login - O usuário deve estar autenticado-->
            @if(! Auth::guest())
                <!--Chat apenas para salas de aulas-->
                <!--Formação de chat-->
                <div id='div-chat-panel' class='black card d-none'>
                    <div class='row white' style='margin:5px;'>
                        <div class='file-field input-field' style='padding:5px;'>
                            <a id='send-message-btn' class='btn-floating waves-effect waves-light blue right'>
                                <i class='material-icons'>send</i>
                            </a>
                            <div class='file-path-wrapper'>
                                <!--Input de mensagem-->
                                <i class='fa fa-comments-o fa-1x prefix'></i>
                                <input type='text' class='white' id='text-message' placeholder='Chat'>
                            </div>
                        </div>
                        <div id='chat-textarea' class='input-field grey lighten-4' style='padding:5px; margin:5px; border:1px solid rgba(80,80,80,0.5); border-radius:5px;'>
                            <!--Output de mensagem-->
                            <textarea class='grey lighten-4 materialize-textarea' style='border:0px;' readonly id='chat-panel'></textarea>
                        </div>
                    </div>
                </div>

                <!-- Modal de solicitação de vez-->
                @if(Auth::user()->type == 0)
                    <div id='msg-solicita' class='modal'>
                        <div class='modal-content'>
                            <h5>
                                <i class='material-icons blue-text'>pan_tool</i> Solicitações:
                                <span class='right'>
                                    <a class='modal-close'>
                                        <i class='fa fa-times grey-text text-darken-3'></i>
                                    </a>
                                </span>
                            </h5>
                            <div class='divider'></div>
                            <ul id='solicita-list' class='collection'>
                            </ul>
                            <br>
                        </div>
                    </div>
                @endif

                <!-- Barra de footer com menu de controle de áudio e video-->
                <nav id='nav-footer' class="nav-wrapper black d-none">
                    <div class="">
                        <ul id='nav-mobile' class='right blue-text'>
                            <li class='hover-footer-btn'>
                                <a id='toggle-camera' data-active='enabled' class='blue-text text-darken-3' title='Camera'>
                                    <i class='material-icons left'>videocam</i> <b class='white-text hide-on-med-and-down'>Camera</b>
                                </a>
                            </li>
                            <li class='hover-footer-btn'>
                                <a id='toggle-mute' data-active='enabled' class='blue-text text-darken-3' title='Microfone'>
                                    <i class='material-icons left'>mic</i> <b class='white-text hide-on-med-and-down'>Microfone</b>
                                </a>
                            </li>
                            <li class='hover-footer-btn'>
                                <a id='toggle-volume' data-active='enabled' class='blue-text text-darken-3' title='Áudio'>
                                    <i class='material-icons left'>volume_up</i> <b class='white-text hide-on-med-and-down'>Áudio</b>
                                </a>
                            </li>
                            <li class='hover-footer-btn'>
                                <a id='toggle-chat' class='blue-text text-darken-3' title='Chat'>
                                    <i class='material-icons left'>forum</i> <b class='white-text hide-on-med-and-down'>Chat</b>
                                </a>
                            </li>
                            <li id='control-pedir-vez' class='hover-footer-btn'>
                                <input id='pedir-vez' type='hidden' disabled readonly value='0' />
                                <a id='lista-pedir-vez' data-active='enabled' class='blue-text text-darken-3 modal-trigger' href='#msg-solicita' title='Solicitações'>
                                    <i class='material-icons left'>pan_tool</i> <b class='white-text hide-on-med-and-down'>Solicitações</b> 
                                </a>
                                <span id='count-pedir-vez' href='#msg-solicita' class="btn-floating btn-small red darken-4 pulse modal-trigger">0</span>
                            </li>
                        </ul>
                    </div>
                </nav>
            @endif
        @else
            <!-- Barra de footer padrão-->
            <footer class="page-footer grey darken-4">
                <div class="container">
                    <div class="row">
                        <div class="col s12">
                            <h5 class="white-text">WebTv</h5>
                            <p class="grey-text text-lighten-1">
                                Protótipo de aplicação voltado à comunicação via webconference utilizando WebRTC e compatível com os navegadores Google Chrome e Mozilla Firefox. 
                                <br>
                                <br>
                                Versão 0.0.1.1
                                <br> 
                                <i class="grey-text right fa fa-firefox"></i>
                                <i class="grey-text right fa fa-chrome"></i> 
                            </p>
                        </div>
                    </div>
                </div>
                <div class="footer-copyright black">
                    <div class='container'>
                        <i class='fa fa-copyright'></i> 2018 I Smart Group SA
                    </div>
                </div>
            </footer>
        @endif
        <!-- Inicialização in-page condicional de elementos para cadastro de perfis de usuários-->
        <!-- A variável $grant deve ser passada pelo controller para a inicialização-->
        @if(isset($grant))
            <script>
                document.querySelector('button').onclick = function(evt) {
                    var values = $('#grantList').val();
                    var strValues = '';
                    for($i = 0; $i<values.length; $i++){
                        strValues += values[$i];
                        if($i != (values.length - 1)){
                            strValues += ';';
                        }
                    }
                    if(strValues == ''){
                        strValues = '0';
                    }
                    document.getElementById('grant').value = strValues;                  
                }
            </script>
        @endif
        <!-- Inicialização in-page condicional de elementos para cadastro de turmas-->
        <!-- A variável $classroom deve ser passada pelo controller para a inicialização-->
        @if(isset($classroom))
            <script>
                document.querySelector('button').onclick = function(evt) {
                    var values = $('#curso_id_list').val();
                    var strValues = '';
                    for($i = 0; $i<values.length; $i++){
                        strValues += values[$i];
                        if($i != (values.length - 1)){
                            strValues += ';';
                        }
                    }
                    if(strValues == ''){
                        strValues = '0';
                    }
                    document.getElementById('curso_id').value = strValues;                  
                }
            </script>
        @endif

        <!-- Inicialização in-page de elementos padrões-->
        <!-- Inicialização padrão de funções e padrões do MaterializeCSS para todas as páginas-->
        <script>

            // M.*: Padrão de inicialização do MaterializeCSS

            $(document).ready(function(){
                //Inicialização do Materialize
                $(".dropdown-trigger").dropdown();
                $('.sidenav').sidenav();
                M.updateTextFields();
                $('input#input_text, textarea#textarea2').characterCounter();
                $('select').formSelect();
                $('.modal').modal();
                $('.tooltipped').tooltip();
            });

            function goback(){
                window.history.back();
            }

        </script>
    </body>
</html>