            
            <!-- Fim do corpo de página -->

            </div>
        </main>
        <!-- Barra de footer padrão-->
        <footer id="main-footer" class="page-footer grey darken-4">
            <div class="container">
                <div class="row">
                    <div class="col s12">
                    <h5 class="white-text">{{ $logo }}</h5>
                        <p class="grey-text text-lighten-1">
                            Protótipo de aplicação voltado à comunicação via webconference utilizando WebRTC e compatível com os navegadores Google Chrome e Mozilla Firefox. 
                            <br>
                            <br>
                            {!! $bookmarkIcon !!} Versão 1.0.1.1
                            <br>
                            <span class='grey-text right'>
                                 {!! $chromeIcon !!} &nbsp; {!! $firefoxIcon !!} 
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="footer-copyright black">
                <div class='container'>
                    {!! $copyRightIcon !!} 2018 Smart Group SA
                </div>
            </div>
        </footer>

        <script type="text/javascript" src="{!! asset('js/jquery-3.1.1.min.js') !!}"></script>
        <script type="text/javascript" src="{!! asset('js/materialize.min.js') !!}"></script>
        <script type="text/javascript" src="{!! asset('js/geral.js') !!}"></script>
        @if(isset($resultToString))
            <!-- Inicialização in-page condicional de elementos das páginas de cadastros -->
            <!-- Utilização do JS para autocomplete -->
            <script type="text/javascript" src="{!! asset('js/formAutocomplete.js') !!}"></script>
        @endif
        @if(isset($streamPage))
            <!-- Inicialização in-page condicional de elementos para a formação de uma sala-->
            <!-- A variável $streamPage deve ser passada pelo controller para inicialização-->
            <!-- Controle de login - O usuário deve estar autenticado-->
            @if(! Auth::guest())
                <!-- Barra com menu de controle de áudio e video-->
                <nav id='nav-footer' class='nav transparent d-none'>
                    <div id='div-mobile'>
                        <ul id='nav-mobile' class='blue-text brand-logo center'>
                            <li class=''>
                                <a id='toggle-camera' data-active='enabled' class='media-control tooltipped' data-position='top' data-tooltip='Camera'>
                                    {!! $videocamIcon !!}
                                </a>
                            </li>
                            <li class=''>
                                <a id='toggle-mute' data-active='enabled' class='media-control tooltipped' data-position='top' data-tooltip='Microfone'>
                                    {!! $micIcon !!}
                                </a>
                            </li>
                            <li class=''>
                                <a id='toggle-volume' data-active='enabled' class='media-control tooltipped' data-position='top' data-tooltip='Áudio'>
                                    {!! $volumeUpIcon !!}
                                </a>
                            </li>
                            <li class=''>
                                <a id='share-screen' data-active='enabled' class='media-control tooltipped' data-position='top' data-tooltip='Compartilhar Tela'>
                                    {!! $screenShareIcon !!}
                                </a>
                            </li>
                            <li class=''>
                                <a id='toggle-screen' data-active='enabled' class='media-control tooltipped' data-position='top' data-tooltip='Expandir'>
                                    {!! $fullscreenIcon !!}
                                </a>
                            </li>
                            <li class=''>
                                <a id='toggle-chat' data-target='slide-out' class='media-control tooltipped sidenav-trigger' data-position='top' data-tooltip='Chat' style='display:block;'>
                                    {!! $forumIcon !!}
                                </a>
                            </li>
                            <li id='control-pedir-vez' class=''>
                                <input id='pedir-vez' type='hidden' disabled readonly value='0' />
                                <a id='lista-pedir-vez' data-active='enabled' class='media-control modal-trigger tooltipped' data-position='top' data-tooltip='Solicitações' href='#msg-solicita'>
                                    {!! $panToolIcon !!}
                                </a>
                                <span id='count-pedir-vez' href='#msg-solicita' class="btn-floating btn-small red darken-4 pulse modal-trigger">0</span>
                            </li>
                        </ul>
                    </div>
                </nav>
                <!-- Adição dos scripts de utilização do WEBRTC-->
                <script type="text/javascript" src="{!! asset('js/webrtc/control-components.js') !!}"></script>  
                <script type="text/javascript" src="{!! asset('js/webrtc/socket.io.js') !!}"></script>
                <script type="text/javascript" src="{!! asset('js/webrtc/getHTMLMediaElement.js') !!}"></script>
                <script type="text/javascript" src="{!! asset('js/webrtc/adapter.js') !!}"></script>                      
                <script type="text/javascript" src="{!! asset('js/webrtc/RTCMultiConnection.min.js') !!}"></script>
                <script type="text/javascript" src="{!! asset('js/webrtc/application.js') !!}"></script>
                <script type="text/javascript" src="{!! asset('js/webrtc/getScreenId.js') !!}"></script>
                <script>
                    // Definições para apresentação do campo de chat
                    var chatHeight = window.screen.height
                    var chatArea = document.getElementById('chat-panel')
                    chatArea.style.height = (chatHeight - 250) + 'px';
                    chatArea.style.maxHeight = (chatHeight - 250) + 'px';
                </script>
            @endif
        @endif
        @if(isset($grant))
            <!-- Inicialização in-page condicional de elementos para cadastro de perfis de usuários-->
            <!-- A variável $grant deve ser passada pelo controller para a inicialização-->
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
        @if(isset($classroom))
            <!-- Inicialização in-page condicional de elementos para cadastro de turmas-->
            <!-- A variável $classroom deve ser passada pelo controller para a inicialização-->
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
                //Inicialização do Materialize com JQuery
                /*
                $(".dropdown-trigger").dropdown();
                $('.sidenav').sidenav();
                $('select').formSelect();
                $('.modal').modal();
                $('.tooltipped').tooltip();
                */
                //Inicialização do Materialize sem utilizar JQuery
                var elems;
                var instances;
                elems = document.querySelectorAll('.dropdown-trigger');
                instances = M.Dropdown.init(elems);
                elems = document.querySelectorAll('.sidenav');
                instances = M.Sidenav.init(elems);
                elems = document.querySelectorAll('select');
                instances = M.FormSelect.init(elems);
                elems = document.querySelectorAll('.modal');
                instances = M.Modal.init(elems);
                elems = document.querySelectorAll('.tooltipped');
                instances = M.Tooltip.init(elems);
                elems = document.querySelectorAll('.collapsible');
                instances = M.Collapsible.init(elems);
                M.updateTextFields();
                $('input#input_text, textarea#textarea2').characterCounter();
            });
        </script>
    </body>
</html>