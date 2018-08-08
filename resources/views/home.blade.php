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
                        <b>Bem vindo ao <span class='blue-text'>{!! $logo !!}</span>.</b><br>
                        Efetue seu acesso para começar.
                    </h2>
                    <div class='divider'></div>
                    <div class='row'>
                        <h3 class='card-title' align='left'>{!! $loginBlueIcon !!} Login</h3>
                        <form class='' action='{{ route('login.access') }}' method='post' enctype="multipart/form-data">
                            {{ csrf_field() }}
                            <div class='row'>
                                <div class='input-field col s12 m6'>
                                    <input class='validate' autofocus required type='text' name='login' id='login'>
                                    <label for='login'>{!! $userOIcon !!} Usuário</label>
                                </div>
                                <div class='input-field col s12 m6'>
                                    <input class='validate' required type='password' name='password' id='password'>
                                    <label for='password'>{!! $lockIcon !!} Senha</label>
                                </div>
                            </div>
                            <div class='card-action' align='right'>
                                <button id='access' type='submit' class='load btn-flat green-text text-darken-2 waves-effect waves-green'>Entrar {!! $signInIcon !!}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            @else
                <div class='row center'>
                    <h2 class='card-title' align='left'>
                        <b>Bem vindo(a) <br><span class='blue-text'>{!! $loginIcon !!} {{ Auth::user()->name }}</span>.</b><br>
                    </h2>
                    <div class='divider'></div>
                    <br>
                    <div class='row grey-text text-darken-3' align='left'>
                        <div class='col s12 m4'>
                            <div class='blue-text center'>
                                <a href="{{ route('salas') }}" title='Transmita'>{!! $transmitLargeIcon !!}</a>
                            </div>
                            <h5>Crie uma sala e inicie sua transmissão em poucos passos</h5>
                            <p>Com a função de salas você pode selecionar o publico alvo, criar e iniciar sua transmissão para um ou vários espectadores simultâneos.</p>
                            <div class='divider'></div>
                            <br/>
                            <p>Clique <a href="{{ route('salas') }}" class='load'><u>aqui</u></a> e inicie sua transmissão em poucos passos!</p>
                        </div>
                        <div class='col s12 m4'>
                            <div class='blue-text center'>
                                <a href="{{ route('salas') }}" title='Compartilhe'>{!! $shareLargeIcon !!}</a>
                            </div>
                            <h5>Transmita, compartilhe e interaja com os espectadores</h5>
                            <p>Todas as salas contam com transmissão de áudio e vídeo, além de suporte a envio de mensagens de texto e compartilhamento de tela simultaneamente.</p>
                            <div class='divider'></div>
                            <br/>
                            <p>Clique <a href="{{ route('salas') }}" class='load'><u>aqui</u></a>, inicie uma transmissão e compartilhe conteúdo!</p>
                        </div>
                        <div class='col s12 m4'>
                            <div class='blue-text center'>
                                <a href="{{ route('admin.cadastro') }}" title='Configure'>{!! $peopleLargeIcon !!}</a>
                            </div>
                            <h5>Gerencie grupos, perfis e usuários em poucos cliques</h5>
                            <p>Acesse a função de gerenciamento e encontre o que precisa para configurar e cadastrar grupos, instituições, usuário e perfis de acesso como desejar.</p>
                            <div class='divider'></div>
                            <br/>
                            <p>Clique <a href="{{ route('admin.cadastro') }}" class='load'><u>aqui</u></a> e gerencie o acesso às suas transmissões!</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class='card-action grey lighten-5'>
                <div class='row'>
                    
                </div>
            </div>
        @endif 
    </div>
    
@endsection