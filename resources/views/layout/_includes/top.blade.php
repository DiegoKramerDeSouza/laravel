
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>@yield('titulo')</title>
    
        <!--Import Google Icon Font-->
        <link href="{!! asset('css/materialicons.css') !!}" media="all" rel="stylesheet" type="text/css" />
        <link href="{!! asset('css/font-awesome.min.css') !!}" media="all" rel="stylesheet" type="text/css" />
        <!--Import materialize.css-->
        <link href="{!! asset('css/materialize.min.css') !!}" media="all" rel="stylesheet" type="text/css" />
        <!--Let browser know website is optimized for mobile-->
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

    <body>
        <header>
            <nav class="nav-wrapper grey darken-4">
                <div class="">
                    <a href='#!' class='sidenav-trigger green-text text-darken-2 right' data-target='side-bar' title='Menu'><i class='fa fa-bars fa-2x'></i></a>
                    <a href='#' class='brand-logo'><span class='blue-text'><b>WebTv</b></span></a>
                    <ul id='nav-mobile' class='right hide-on-med-and-down blue-text'>
                        <li>
                            <a id='homeicon' href='#'>
                                <span class='blue-text'><span class='fa fa-home fa-lg'></span> <b>Início</b></span>
                            </a>
                        </li>
                        <li>
                            <a href="{{ route('salas') }}"><span class='blue-text'><span class='fa fa-desktop fa-lg'></span> <b>Salas</b></span></a>
                        </li>
                        <li>
                            <a class='' id='gerDrop' href='{{ route('admin.cadastro') }}'>
                                <b><span class='blue-text'><span class='fa fa-user-plus fa-lg'></span> Cadastro</span></b>
                            </a>
                        </li>						
                        <li>
                            <a class='dropdown-trigger' id='userDropDown' href='#!' data-target='myProfile'>
                                <div id='userChip' class='chip blue darken-1 white-text'>
                                    @yield('nome')
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>		
                <ul id='dropGer' class='dropdown-content'>
                    <li class='grey darken-4'><a href='#!' class='red-text text-darken-3'><i class='fa fa-sign-out fa-lg'></i> <b>Sair</b></a></li>
                </ul>
                <ul id='myProfile' class='dropdown-content'>
                    <li class='grey darken-4'><a href='#' class='blue-text'><i class='fa fa-user'></i>Perfil</a></li>
                    <li class='grey darken-4'><a href='#' class='blue-text'><i class='fa fa-book'></i>Conteúdo</a></li>
                    <li class='grey darken-4'><a href='#!' class='red-text text-darken-2'><i class='fa fa-sign-out fa-lg'></i>Sair</a></li>
                </ul>
                
            </nav>
            
            <div id='side-bar' class='sidenav'>
                <ul>
                    <li>
                        <a id='homeicon' href='#'>
                            <span class='blue-text'><span class='fa fa-home fa-lg'></span> <b>Início</b></span>
                        </a>
                    </li>
                    <li>
                        <a href="{{ route('salas') }}"><span class='blue-text'><span class='fa fa-desktop fa-lg'></span> <b>Salas</b></span></a>
                    </li>
                    <li>
                        <a class='' id='gerDrop' href='{{ route('admin.cadastro') }}'>
                            <b><span class='blue-text'><span class='fa fa-user-plus fa-lg'></span> Cadastro</span></b>
                        </a>
                    </li>						
                    <li>
                        <a class='dropdown-trigger' id='userDropDown' href='#!' data-target='side-myProfile'>
                            <div id='userChip' class='chip blue darken-1 white-text'>
                                @yield('nome')
                            </div>
                        </a>
                    </li>
                </ul>
                <ul id='side-dropGer' class='dropdown-content'>
                    <li class='grey darken-4'><a href='#!' class='red-text text-darken-3'><i class='fa fa-sign-out fa-lg'></i> <b>Sair</b></a></li>
                </ul>
                <ul id='side-myProfile' class='dropdown-content'>
                    <li class='grey darken-4'><a href='#' class='blue-text'><i class='fa fa-user'></i>Perfil</a></li>
                    <li class='grey darken-4'><a href='#' class='blur-text'><i class='fa fa-book'></i>Conteúdo</a></li>
                    <li class='grey darken-4'><a href='#!' class='red-text text-darken-3'><i class='fa fa-sign-out fa-lg'></i>Sair</a></li>
                </ul>
            </div>

        </header>
        <main>
            <div>
				<img id="backgroundLayer" src="{!! asset('img/bg.jpg') !!}" />
			</div>
            <div class='container'>

    
