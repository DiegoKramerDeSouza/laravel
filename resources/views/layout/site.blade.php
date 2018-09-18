<!-- Layout padrão da aplicação - Extendido -->

<!-- Incude top - layout._includes.top -->
@include('layout._includes.top')

<!-- Montagem da página - section('content') -->
@yield('content')

<!-- Incude bottom - layout._includes.bottom -->
@include('layout._includes.bottom')
   
