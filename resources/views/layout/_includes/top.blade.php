
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
                background-color: #fff;
                color: #636b6f;
                font-family: 'Raleway', sans-serif;
                font-weight: 100;
                height: 100vh;
                margin: 0;
            }

            .full-height {
                height: 100vh;
            }

            .flex-center {
                align-items: center;
                display: flex;
                justify-content: center;
            }

            .position-ref {
                position: relative;
            }

            .top-right {
                position: absolute;
                right: 10px;
                top: 18px;
            }

            .content {
                text-align: center;
            }

            .title {
                font-size: 84px;
            }

            .links > a {
                color: #636b6f;
                padding: 0 25px;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: .1rem;
                text-decoration: none;
                text-transform: uppercase;
            }

            .m-b-md {
                margin-bottom: 30px;
            }
        </style>
    </head>

    <body>
        <header>
            <nav class="nav-wrapper grey darken-4">
                <div class="">
                    <a href='#!' class='sidenav-trigger green-text text-darken-2 right' data-target='side-bar' title='Menu'><i class='fa fa-bars fa-2x'></i></a>
                    <a href='#' class='brand-logo'><span class='green-text text-darken-2'>WebTv</span></a>
                    <ul id='nav-mobile' class='right hide-on-med-and-down'>
                        <li>
                            <a id='homeicon' href='#'>
                                <span class='green-text text-darken-1'><span class='fa fa-home fa-lg'></span> <b>Início</b></span>
                            </a>
                        </li>
                        <li>
                            <a href="#!"><span class='green-text text-darken-1'><span class='fa fa-pie-chart fa-lg'></span> <b>Salas</b></span></a>
                        </li>
                        <li>
                            <a class='dropdown-trigger' id='gerDrop' href='#!' data-target='dropGer'>
                                <b><span class='green-text text-darken-1'><span class='fa fa-sitemap fa-lg'></span> Cadastro</span></b>
                            </a>
                        </li>						
                        <li>
                            <a class='dropdown-trigger' id='userDropDown' href='#!' data-target='myProfile'>
                                <div id='userChip' class='chip green darken-1 white-text'>
                                    Acesso
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>		
                <ul id='dropGer' class='dropdown-content'>
                    <li class='grey darken-4'><a href='#!' class='red-text text-darken-3'><i class='fa fa-sign-out fa-lg'></i> <b>Sair</b></a></li>
                </ul>
                <ul id='myProfile' class='dropdown-content'>
                    <li class='grey darken-4'><a href='#' class='green-text text-darken-1'><i class='fa fa-cube'></i>Perfil</a></li>
                    <li class='grey darken-4'><a href='#' class='green-text text-darken-1'><i class='fa fa-hdd-o'></i>Conteúdo</a></li>
                    <li class='grey darken-4'><a href='#!' class='red-text text-darken-3'><i class='fa fa-sign-out fa-lg'></i> <b>Sair</b></a></li>
                </ul>
                
            </nav>
            <!--
            <ul id='side-bar' class='sidenav'>
                <li>
                    <a id='homeicon' href='#'>
                        <span class='green-text text-darken-1'><span class='fa fa-home fa-lg'></span> <b>Início</b></span>
                    </a>
                </li>
                <li>
                    <a href="#!"><span class='green-text text-darken-1'><span class='fa fa-pie-chart fa-lg'></span> <b>Salas</b></span></a>
                </li>
                <li>
                    <a class='dropdown-trigger' id='gerDrop' href='#!' data-target='dropGer'>
                        <b><span class='green-text text-darken-1'><span class='fa fa-sitemap fa-lg'></span> Cadastro</span></b>
                    </a>
                </li>						
                <li>
                    <a class='dropdown-trigger' id='userDropDown' href='#!' data-target='myProfile'>
                        <div id='userChip' class='chip green darken-1 white-text'>
                            Acesso
                        </div>
                    </a>
                </li>
            </ul>
        -->
        </header>
        <main>
            <div class='container'>

    
