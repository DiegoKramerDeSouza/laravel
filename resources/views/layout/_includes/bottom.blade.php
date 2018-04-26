        
            </div>
        </main>
        <!--JavaScript at end of body for optimized loading-->
        <script type="text/javascript" src="{!! asset('js/jquery-3.1.1.min.js') !!}"></script>
        <script type="text/javascript" src="{!! asset('js/materialize.min.js') !!}"></script>
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
                        <a href='#!' class='sidenav-trigger blue-text blue-darken-3 right' data-target='side-bar' title='Menu'><i class='fa fa-bars fa-2x'></i></a>
                        <ul id='nav-mobile' class='right hide-on-med-and-down blue-text'>
                            <li>
                                <a href='#'>
                                    <span class='blue-text text-darken-3'><i class='material-icons left'>volume_up</i> <b>Volume</b></span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <span class='blue-text text-darken-3'><i class='material-icons left'>mic_off</i> <b>Mudo</b></span>
                                </a>
                            </li>
                            <li>
                                <a id='toggle-chat' class='blue-text text-darken-3'>
                                    <i class='material-icons left'>forum</i> <b>Chat</b>
                                </a>
                            </li>
                            <li>
                                <a href='#'>
                                    <span class='blue-text text-darken-3'><i class='material-icons left'>pan_tool</i> <b>Pedir a vez</b></span>
                                </a>
                            </li>
                        </ul>
                    </div>		
                </nav>
            @endif
        @endif
        @if(isset($grant))
            <script>
                document.querySelector('button').onclick = function(evt) {
                    var values = $('#grantList').val();
                    var strValues = '';
                    for($i = 0; $i<values.length; $i++){
                        strValues += values[$i]
                        if($i != (values.length - 1)){
                            strValues += ';';
                        }
                    }
                    if(strValues == ''){
                        strValues = '0';
                    }
                    document.getElementById('grant').value = strValues;
                    //console.log(strValues);                    
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
        </script>

    </body>
</html>