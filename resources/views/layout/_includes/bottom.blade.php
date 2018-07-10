            
            <!-- Fim do corpo de página -->

            </div>
        </main>
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

        <!-- Inicialização de Javascript -->
        <script type="text/javascript" src="{!! asset('js/init.data.config.js') !!}"></script>
        <script type="text/javascript" src="{!! asset('js/jquery-3.1.1.min.js') !!}"></script>
        <script type="text/javascript" src="{!! asset('js/materialize.min.js') !!}"></script>
        <script type="text/javascript" src="{!! asset('js/geral.js') !!}"></script>

        @if(isset($resultToString))
            <!-- Elementos das páginas de cadastros para autocomplete -->
            <script type="text/javascript" src="{!! asset('js/formAutocomplete.js') !!}"></script>
        @endif
        @if(isset($streamPage))
            <!-- Elementos para a formação de uma SALA ==================================================== -->
            @if(! Auth::guest())
                <!-- Adição dos scripts de utilização do WEBRTC-->
                <script type="text/javascript" src="{!! asset('js/conf/conf.js') !!}"></script>

                <script type="text/javascript" src="{!! asset('js/models/Structure.js') !!}"></script>  
                <script type="text/javascript" src="{!! asset('js/controllers/StructureController.js') !!}"></script>  
                <script type="text/javascript" src="{!! asset('js/models/Room.js') !!}"></script>  
                <script type="text/javascript" src="{!! asset('js/controllers/RoomController.js') !!}"></script>
                <script type="text/javascript" src="{!! asset('js/models/RoomData.js') !!}"></script>  
                <script type="text/javascript" src="{!! asset('js/controllers/RoomDataController.js') !!}"></script>
                <script type="text/javascript" src="{!! asset('js/models/RoomInfo.js') !!}"></script>  
                <script type="text/javascript" src="{!! asset('js/controllers/RoomInfoController.js') !!}"></script>
                <script type="text/javascript" src="{!! asset('js/models/Connect.js') !!}"></script>  
                <script type="text/javascript" src="{!! asset('js/controllers/ConnectController.js') !!}"></script>  
                <script type="text/javascript" src="{!! asset('js/models/Media.js') !!}"></script>  
                <script type="text/javascript" src="{!! asset('js/controllers/MediaController.js') !!}"></script>

                <script type="text/javascript" src="{!! asset('js/models/Message.js') !!}"></script>  
                <script type="text/javascript" src="{!! asset('js/views/MessageView.js') !!}"></script>
                <script type="text/javascript" src="{!! asset('js/views/RoomView.js') !!}"></script>

                <script type="text/javascript" src="{!! asset('js/helpers/RoomHelper.js') !!}"></script>    

                <script type="text/javascript" src="{!! asset('js/webrtc/control-components.js') !!}"></script>   
                <script type="text/javascript" src="{!! asset('js/webrtc/socket.io.js') !!}"></script>
                <script type="text/javascript" src="{!! asset('js/webrtc/getHTMLMediaElement.js') !!}"></script>
                <script type="text/javascript" src="{!! asset('js/webrtc/adapter.js') !!}"></script>                      
                <script type="text/javascript" src="{!! asset('js/webrtc/RTCMultiConnectionNew.min.js') !!}"></script>
                <script type="text/javascript" src="{!! asset('js/webrtc/MultiStreamsMixer.min.js') !!}"></script>
                <script type="text/javascript" src="{!! asset('js/webrtc/application.js') !!}"></script>
                <script type="text/javascript" src="{!! asset('js/webrtc/getScreenId.js') !!}"></script>
                <script type="text/javascript" src="{!! asset('js/chat.bottom.js') !!}"></script>
            @endif
            <!-- ========================================================================================== -->
        @endif
        @if(isset($grant))
            <!-- Elemento para cadastro de perfis de usuários-->
            <script type="text/javascript" src="{!! asset('js/grant.bottom.js') !!}"></script>
        @endif
        @if(isset($classroom))
            <!-- Elemento para cadastro de turmas-->
            <script type="text/javascript" src="{!! asset('js/turmas.bottom.js') !!}"></script>
        @endif
        <!-- Inicialização de elementos MaterializeCSS -->
        <script type="text/javascript" src="{!! asset('js/materialize.bottom.js') !!}"></script>
    </body>
</html>