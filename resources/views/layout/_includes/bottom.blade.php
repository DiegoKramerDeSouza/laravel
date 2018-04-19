        
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
            });
        </script>

    </body>
</html>