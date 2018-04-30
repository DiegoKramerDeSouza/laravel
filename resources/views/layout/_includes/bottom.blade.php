        
            </div>
        </main>
        <!--JavaScript at end of body for optimized loading-->
        <script type="text/javascript" src="{!! asset('js/jquery-3.1.1.min.js') !!}"></script>
        <script type="text/javascript" src="{!! asset('js/materialize.min.js') !!}"></script>

        <!--Inicialização in-page condicional de elementos para a formação de uma sala-->
        @if(isset($streamPage))
            <!--Adição dos scripts de utilização do WEBRTC-->
            <script type="text/javascript" src="{!! asset('js/webrtc/socket.io.js') !!}"></script>
            <script type="text/javascript" src="{!! asset('js/webrtc/getHTMLMediaElement.js') !!}"></script>
            <script type="text/javascript" src="{!! asset('js/webrtc/RTCMultiConnection.min.js') !!}"></script>
            <script type="text/javascript" src="{!! asset('js/webrtc/application.js') !!}"></script>
            <script>
                $(document).ready(function(){
                    M.textareaAutoResize($('#chat-panel'));
                });
            </script>

            @if(! Auth::guest())
                <!--Chat apenas para salas de aulas-->
                <!--Formação de chat-->
                <div id='div-chat-panel' class='grey darken-4 card d-none'>
                    <div class='row white' style='margin:10px;'>
                        <div class='file-field input-field' style='padding:5px;'>
                            <a id='send-message-btn' class='btn-floating waves-effect waves-light blue right'>
                                <i class='material-icons'>send</i>
                            </a>
                            <div class='file-path-wrapper'>
                                <!--Input de mensagem-->
                                <input type='text' class='white' id='text-message' placeholder='Chat'>
                            </div>
                        </div>
                        <div id='chat-textarea' class='input-field'>
                            <!--Output de mensagem-->
                            <textarea class='grey lighten-3 materialize-textarea' readonly id='chat-panel'></textarea>
                        </div>
                    </div>
                </div>

                <!--Barra de footer menu-->
                <nav id='nav-footer' class="nav-wrapper black">
                    <div class="">
                        <ul id='nav-mobile' class='right blue-text'>
                            <li>
                                <a href='#' title='Camera'>
                                    <span class='blue-text text-darken-3'><i class='material-icons left'>videocam</i> <b class='white-text hide-on-med-and-down'>Camera</b></span>
                                </a>
                            </li>
                            <li>
                                <a href='#' title='Volume'>
                                    <span class='blue-text text-darken-3'><i class='material-icons left'>volume_up</i> <b class='white-text hide-on-med-and-down'>Volume</b></span>
                                </a>
                            </li>
                            <li>
                                <a href="#" title='Mudo'>
                                    <span class='blue-text text-darken-3'><i class='material-icons left'>mic_off</i> <b class='white-text hide-on-med-and-down'>Mudo</b></span>
                                </a>
                            </li>
                            <li>
                                <a id='toggle-chat' title='Chat' class='blue-text text-darken-3'>
                                    <i class='material-icons left'>forum</i> <b class='white-text hide-on-med-and-down'>Chat</b>
                                </a>
                            </li>
                            <li>
                                <a href='#' title='Pedir a vez'>
                                    <span class='blue-text text-darken-3'><i class='material-icons left'>pan_tool</i> <b class='white-text hide-on-med-and-down'>Pedir a vez</b></span>
                                </a>
                            </li>
                        </ul>
                    </div>		
                </nav>
            @endif
        @else
            <footer class="page-footer grey darken-4">
                <div class="container">
                    <div class="row">
                        <div class="col s12">
                            <h5 class="white-text">WebTv</h5>
                            <p class="grey-text text-lighten-4">
                                Protótipo de aplicação voltado à comunicação via webconference utilizando WebRTC e compatível com os navegadores Google Chrome e Mozilla Firefox. 
                                <br>
                                <br>
                                Versão 0.1.0.1
                                <br> 
                                <i class="grey-text text-lighten-4 right fa fa-firefox"></i>
                                <i class="grey-text text-lighten-4 right fa fa-chrome"></i> 
                            </p>
                        </div>
                    </div>
                </div>
                <div class="footer-copyright black">
                    <div class='container'>
                        © 2018 Intelit Smart Group SA
                    </div>
                </div>
            </footer>
        @endif
        <!--Inicialização in-page condicional de elementos para cadastro de perfis de usuários-->
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
        <!--Inicialização in-page condicional de elementos para cadastro de turmas-->
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

        <!--Inicialização in-page de elementos padrões-->
        <script>
            $(document).ready(function(){
                //Inicialização do Materialize
                $(".dropdown-trigger").dropdown();
                $('.sidenav').sidenav();
                M.updateTextFields();
                $('input#input_text, textarea#textarea2').characterCounter();
                $('select').formSelect();
                $('.modal').modal();
            });

            function goback(){
                window.history.back();
            }

        </script>
    </body>
</html>