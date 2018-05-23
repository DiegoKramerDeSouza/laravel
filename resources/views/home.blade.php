<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Início')

<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            @if(Auth::guest())
                <div class='row center container'>
                    <h2 class='card-title' align='left'>
                        <b>Bem vindo ao <span class='blue-text'>WebTV</span>.</b><br>
                        Efetue seu acesso para começar.
                    </h2>
                    <div class='divider'></div>
                    <div class='row'>
                        <h3 class='card-title' align='left'><i class='fa fa-user-circle blue-text'></i> Login</h3>
                        <form class='' action='{{ route('login.access') }}' method='post' enctype="multipart/form-data">
                            {{ csrf_field() }}
                            <div class='row'>
                                <div class='input-field col s12 m6'>
                                    <input class='validate' autofocus required type='text' name='login' id='login'>
                                    <label for='login'><i class='fa fa-user-o'></i> Usuário</label>
                                </div>
                                <div class='input-field col s12 m6'>
                                    <input class='validate' required type='password' name='password' id='password'>
                                    <label for='password'><i class='fa fa-lock'></i> Senha</label>
                                </div>
                            </div>
                            <div class='card-action' align='right'>
                                <button id='access' type='submit' class='load btn-flat green-text text-darken-2 waves-effect waves-green'>Entrar <i class='fa fa-sign-in'></i></button>
                            </div>
                        </form>
                    </div>
                </div>
            @else
                <div class='row center'>
                    <h2 class='card-title' align='left'>
                        <b>Bem vindo(a) <br><span class='blue-text'><i class='fa fa-user-circle'></i> {{ Auth::user()->name }}</span>.</b><br>
                    </h2>
                    <div class='divider'></div>
                    <br>
                    <div class='row grey-text text-darken-3' align='left'>
                        <div class='col s12 m4'>
                            <div class='blue-text center'>
                                <a href="{{ route('salas') }}" title='Transmita'><i class='material-icons large'>wifi_tethering</i></a>
                            </div>
                            <h5>Crie uma sala e inicie sua transmissão!</h5>
                            <p>Com a função de salas você pode iniciar sua transmissão para um ou vários espectadores simultâneos.</p>
                            <p>Clique <a href="{{ route('salas') }}"><u>aqui</u></a> para começar!</p>
                        </div>
                        <div class='col s12 m4'>
                            <div class='blue-text center'>
                                <a href="{{ route('salas') }}" title='Compartilhe'><i class='material-icons large'>share</i></a>
                            </div>
                            <h5>Amplie a interação com os espectadores!</h5>
                            <p>Todas as salas contam com transmissão de áudio e vídeo, além de suporte a envio de mensagens de texto e compartilhamento de tela simultaneamente.</p>
                            <p>Clique <a href="{{ route('salas') }}"><u>aqui</u></a> para começar!</p>
                        </div>
                        <div class='col s12 m4'>
                            <div class='blue-text center'>
                                <a href="{{ route('admin.cadastro') }}" title='Configure'><i class='material-icons large'>people_outline</i></a>
                            </div>
                            <h5>Personalize perfis e usuários!</h5>
                            <p>Com a função de cadastros você pode configurar e gerenciar cursos, instituições e usuário como desejar.</p>
                            <p>Clique <a href="{{ route('admin.cadastro') }}">aqui</a> para começar!</p>
                        </div>
                    </div>
                </div>
            @endif 
        </div>
    </div>
    
@endsection