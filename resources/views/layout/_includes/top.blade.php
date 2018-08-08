
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

        <title>@yield('titulo')</title>
    
        <link href="{!! asset('css/materialicons.css') !!}" media="all" rel="stylesheet" type="text/css" />
        <link href="{!! asset('css/estilo_ids.css') !!}" media="all" rel="stylesheet" type="text/css" />
        <link href="{!! asset('css/estilo_classes.css') !!}" media="all" rel="stylesheet" type="text/css" />
        <link href="{!! asset('css/font-awesome.min.css') !!}" media="all" rel="stylesheet" type="text/css" />
        <link href="{!! asset('css/raleway.css') !!}" rel="stylesheet" type="text/css">
        <link href="{!! asset('css/materialize.min.css') !!}" media="all" rel="stylesheet" type="text/css" />
        @if(! Auth::guest() && Auth::user()->type == 0)
            <!--Instalação inline de extensão do chrome para compartilhamento de tela-->
            <!--<link rel="chrome-webstore-item" href="path $chromeExt">-->
        @endif        
    </head>

    <body class='grey'>
        <header>
            <nav class="nav-wrapper grey darken-4">
                <div class="">
                    <a href='#!' class='sidenav-trigger white-text text-darken-3 right' data-target='side-bar' title='Menu'>{!! $menuIcon !!}</a>
                    <a href='{{ route('home') }}' class='brand-logo load-cancel'><span class='white-text'>&nbsp;&nbsp;<b><span class='blue-text'>Web</span>Tv</b></span></a>
                    <ul id='nav-mobile' class='right hide-on-med-and-down white-text'>
                        @if(! Auth::guest())
                            @if(Auth::user()->type == 0)
                                <li class='hover-footer-btn'>
                                    <a id='homeicon' href='{{ route('home') }}' class='load-cancel'>
                                        <span class='white-text'>{!! $homeBlueIcon !!} <b>Início</b></span>
                                    </a>
                                </li>
                                <li class='hover-footer-btn'>
                                    <a href="{{ route('salas') }}" class='load-cancel'><span class='white-text'>{!! $roomsBlueIcon !!} <b>Salas</b></span></a>
                                </li>
                                <li class='hover-footer-btn'>
                                    <a id='gerDrop' class='load-cancel' href='{{ route('admin.cadastro') }}'>
                                        <span class='white-text'>{!! $manageBlueIcon !!} <b>Gerenciar</b></span>
                                    </a>
                                </li>
                            @endif
                            <li class='hover-footer-btn'>
                                <a class='dropdown-trigger' id='userDropDown' href='#!' data-target='myProfile'>
                                    <div id='userChip' class='chip white darken-1 blue-text'>
                                        <b>{{Auth::user()->name}}</b>
                                    </div>
                                </a>
                            </li>
                        @endif
                    </ul>
                </div>
                @if(! Auth::guest())		
                    <ul id='myProfile' class='dropdown-content'>
                        @if(Auth::user()->type == 0)
                            <li class='white'><a href='#' class=''>{!! $configBlueIcon !!} Configurações</a></li>
                        @endif
                        <li class='white'><a href='#' class=''>{!! $bookBlueIcon !!} Aulas</a></li>
                        <li class='white'><a href='{{ route('login.destroy')}}' class='load-cancel red-text text-darken-2'>{!! $signOutRedIcon !!} Sair</a></li>
                    </ul>
                @endif
            </nav>
            <div id='side-bar' class='sidenav z-depth-5'>
                <h4 class='blue-text' style='margin:10px;'><b>Web<span class='grey-text text-darken-3'>Tv</span></b></h4>
                <div class='divider'></div>
                <ul>
                    @if(Auth::guest())
                        <li>
                            <a href="{{ route('login') }}" class='load-cancel'><span class='grey-text text-darken-3'>{!! $loginBlueIcon !!} <b>Login</b></span></a>
                        </li>
                    @else
                        @if(Auth::user()->type == 0)
                            <li>
                                <a id='homeicon' href='{{ route('home') }}' class='load-cancel'>
                                    <span class='grey-text text-darken-3'>{!! $homeBlueIcon !!} <b>Início</b></span>
                                </a>
                            </li>
                            <li>
                                <a href="{{ route('salas') }}" class='load-cancel'><span class='grey-text text-darken-3'>{!! $roomsBlueIcon !!} <b>Salas</b></span></a>
                            </li>
                            <li>
                                <a class='load-cancel' id='gerDrop' href='{{ route('admin.cadastro') }}'>
                                    <b><span class='grey-text text-darken-3'>{!! $manageBlueIcon !!} 123</span></b>
                                </a>
                            </li>
                        @endif					
                        <li>
                            <a class='dropdown-trigger' id='userDropDown' href='#!' data-target='side-myProfile'>
                                <div id='userChip' class='chip blue darken-1 white-text'>
                                    {{Auth::user()->name}}
                                </div>
                            </a>
                        </li>
                    @endif
                </ul>
                <ul id='side-dropGer' class='dropdown-content'>
                    <li class='grey darken-4'><a href='{{ route('login.destroy')}}' class='load-cancel red-text text-darken-3'>{!! $signOutRedIcon !!} <b>Sair</b></a></li>
                </ul>
                @if(! Auth::guest())
                    <ul id='side-myProfile' class='dropdown-content'>
                        @if(Auth::user()->type == 0)
                            <li><a href='#' class='grey-text text-darken-3'>{!! $configBlueIcon !!} Configurações</a></li>
                        @endif
                        <li><a href='#' class='grey-text text-darken-3'>{!! $bookBlueIcon !!} Aulas</a></li>
                        <li><a href='{{ route('login.destroy')}}' class='load-cancel red-text text-darken-3'>{!! $signOutRedIcon !!} Sair</a></li>
                    </ul>
                @endif
            </div>
        </header>
        <main>
            <!-- Tela de loading -->
            <div id='fglayer' class='fg-layer grey darken-4 d-none'>
            </div>
            <div id='centralized' align='center' class='white-text d-none'>
            </div>
            <!-- Imagem de fundo -->
            <div class='backgroundImage-Layer'>
				<img id="backgroundLayer" src="{!! asset($bgImage) !!}" />
            </div>
            <!-- Conteúdo da página em container -->
            <div id='main-content' class='main-container'>

            <!-- Corpo central de página -->

    
