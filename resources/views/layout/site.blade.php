<!--Arquivo de layout padrão da aplicação-->
<!--Deve ser extendido pela view-->

<!--Incude para complemento dos arquivos de layout - layout._includes.top-->
@include('layout._includes.top')

<!--Sessão que será inserida na montagem da página - section('content')-->
@yield('content')

<!--Incude para complemento dos arquivos de layout - layout._includes.bottom-->
@include('layout._includes.bottom')
   
