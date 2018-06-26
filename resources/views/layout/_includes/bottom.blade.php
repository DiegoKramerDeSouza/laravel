            
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

        <!-- Condicionais.start -->
        @if(isset($resultToString))
            <!-- Elementos das páginas de cadastros para autocomplete -->
            <!-- A variável $resultToString deve ser passada pelo controller para inicialização-->
            <script type="text/javascript" src="{!! asset('js/formAutocomplete.js') !!}"></script>
        @endif
        @if(isset($streamPage))
            <!-- Elementos para a formação de uma sala-->
            <!-- A variável $streamPage deve ser passada pelo controller para inicialização-->
            @if(! Auth::guest())
                <!-- O usuário deve estar autenticado-->
                <!-- Adição dos scripts de utilização do WEBRTC-->
                <script type="text/javascript" src="{!! asset('js/model/Connect.js') !!}"></script>  
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
        @endif
        @if(isset($grant))
            <!-- Elemento para cadastro de perfis de usuários-->
            <!-- A variável $grant deve ser passada pelo controller para a inicialização-->
            <script type="text/javascript" src="{!! asset('js/grant.bottom.js') !!}"></script>
        @endif
        @if(isset($classroom))
            <!-- Elemento para cadastro de turmas-->
            <!-- A variável $classroom deve ser passada pelo controller para a inicialização-->
            <script type="text/javascript" src="{!! asset('js/turmas.bottom.js') !!}"></script>
        @endif
        <!-- Condicionais.end -->

        <!-- Inicialização de elementos MaterializeCSS para todas as páginas -->
        <!-- Deve ser executada por último -->
        <script type="text/javascript" src="{!! asset('js/materialize.bottom.js') !!}"></script>
    </body>
</html>