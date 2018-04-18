        
            </div>
        </main>
        <!--JavaScript at end of body for optimized loading-->
        <script type="text/javascript" src="{!! asset('js/jquery-3.1.1.min.js') !!}"></script>
        <script type="text/javascript" src="{!! asset('js/materialize.min.js') !!}"></script>
        <script>
            $(document).ready(function(){
                //console.log('Page loaded');
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