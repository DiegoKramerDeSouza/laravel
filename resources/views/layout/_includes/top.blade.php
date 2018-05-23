
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>@yield('titulo')</title>
    
        <!--Importa icones do fontawesome e materialicons-->
        <link href="{!! asset('css/materialicons.css') !!}" media="all" rel="stylesheet" type="text/css" />
        <link href="{!! asset('css/estilo_ids.css') !!}" media="all" rel="stylesheet" type="text/css" />
        <link href="{!! asset('css/estilo_classes.css') !!}" media="all" rel="stylesheet" type="text/css" />
        <link href="{!! asset('css/font-awesome.min.css') !!}" media="all" rel="stylesheet" type="text/css" />
        <!--Importa materialize.css-->
        <link href="{!! asset('css/materialize.min.css') !!}" media="all" rel="stylesheet" type="text/css" />
        @if(! Auth::guest())
            @if(Auth::user()->type == 0)
                <!--Instalação inline de extensão do chrome para compartilhamento de tela-->
                <link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk">
            @endif
        @endif
        <!--Informa ao browser que está pronto para acesso mobile-->
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <!-- Fonts -->
        <link href="{!! asset('css/raleway.css') !!}" rel="stylesheet" type="text/css">

        <!-- Styles -->
        <style>
            html, body {
                font-family: 'Raleway', sans-serif;
            }
        </style>
    </head>

    <body class='grey'>
        <header>
            <nav class="nav-wrapper grey darken-4">
                <div class="">
                    <a href='#!' class='sidenav-trigger white-text text-darken-3 right' data-target='side-bar' title='Menu'><i class='fa fa-bars fa-2x'></i></a>
                    <a href='{{ route('home') }}' class='brand-logo load'><span class='white-text'>&nbsp;&nbsp;<b><span class='blue-text'>Web</span>Tv</b></span></a>
                    <ul id='nav-mobile' class='right hide-on-med-and-down white-text'>
                        @if(! Auth::guest())
                            @if(Auth::user()->type == 0)
                                <li class='hover-footer-btn'>
                                    <a id='homeicon' href='{{ route('home') }}' class='load'>
                                        <span class='white-text'><span class='fa fa-home fa-lg blue-text'></span> <b>Início</b></span>
                                    </a>
                                </li>
                                <li class='hover-footer-btn'>
                                    <a href="{{ route('salas') }}" class='load'><span class='white-text'><span class='fa fa-television fa-lg blue-text'></span> <b>Salas</b></span></a>
                                </li>
                                <li class='hover-footer-btn'>
                                    <a id='gerDrop' class='load' href='{{ route('admin.cadastro') }}'>
                                        <b><span class='white-text'><span class='fa fa-user-plus fa-lg blue-text'></span> Cadastro</span></b>
                                    </a>
                                </li>
                            @endif
                            <li class='hover-footer-btn'>
                                <a class='dropdown-trigger' id='userDropDown' href='#!' data-target='myProfile'>
                                    <!--Chip com as informações de usuário-->
                                    <div id='userChip' class='chip white darken-1 blue-text'>
                                        <b>{{Auth::user()->name}}</b>
                                    </div>
                                </a>
                            </li>
                        @endif
                    </ul>
                </div>		
                <ul id='myProfile' class='dropdown-content'>
                    <li class='white'><a href='#' class=''><i class='fa fa-cog blue-text'></i> Configurações</a></li>
                    <li class='white'><a href='#' class=''><i class='fa fa-book blue-text'></i> Aulas</a></li>
                    <li class='white'><a href='{{ route('login.destroy')}}' class='red-text text-darken-2'><i class='fa fa-sign-out fa-lg'></i>Sair</a></li>
                </ul>
                
            </nav>
            
            <div id='side-bar' class='sidenav'>
                <h4 class='blue-text' style='margin:10px;'><b>Web<span class='grey-text text-darken-3'>Tv</span></b></h4>
                <div class='divider'></div>
                <ul>
                    @if(Auth::guest())
                        <li>
                            <a href="{{ route('login') }}" class='load'><span class='grey-text text-darken-3'><span class='fa fa-user-circle fa-lg blue-text'></span> <b>Login</b></span></a>
                        </li>
                    @else
                        @if(Auth::user()->type == 0)
                            <li>
                                <a id='homeicon' href='{{ route('home') }}' class='load'>
                                    <span class='grey-text text-darken-3'><span class='fa fa-home fa-lg blue-text'></span> <b>Início</b></span>
                                </a>
                            </li>
                            <li>
                                <a href="{{ route('salas') }}" class='load'><span class='grey-text text-darken-3'><span class='fa fa-television fa-lg blue-text'></span> <b>Salas</b></span></a>
                            </li>
                            <li>
                                <a class='load' id='gerDrop' href='{{ route('admin.cadastro') }}'>
                                    <b><span class='grey-text text-darken-3'><span class='fa fa-user-plus fa-lg blue-text'></span> Cadastro</span></b>
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
                    <li class='grey darken-4'><a href='{{ route('login.destroy')}}' class='load red-text text-darken-3'><i class='fa fa-sign-out fa-lg'></i> <b>Sair</b></a></li>
                </ul>
                <ul id='side-myProfile' class='dropdown-content'>
                    <li><a href='#' class='grey-text text-darken-3'><i class='fa fa-cog blue-text'></i> Configurações</a></li>
                    <li><a href='#' class='grey-text text-darken-3'><i class='fa fa-book blue-text'></i> Aulas</a></li>
                    <li><a href='{{ route('login.destroy')}}' class='load red-text text-darken-3'><i class='fa fa-sign-out fa-lg red-text'></i>Sair</a></li>
                </ul>
            </div>

        </header>
        <main>
            <div id='fglayer' class='fg-layer grey darken-4 d-none'>
            </div>
            <div id='centralized' align='center' class='white-text d-none'>
            </div>
            <div class=''>
				<img id="backgroundLayer" src="{!! asset('img/bg.jpg') !!}" />
            </div>
            <div class='container' style='margin-top:40px; padding-bottom:60px;'>

    
