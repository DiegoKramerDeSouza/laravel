<div id='initial-access' class='row'>
    <div class='white-text'>
        @if(Auth::user()->type == 0)
        <div id='opend-rooms' class='col s12 m6'>
            <h4 class='row'>
                <span><b>{!! $default->roomsIcon !!} Salas disponíveis</b></span>
            </h4>
        @else
        <div id='opend-rooms' class='col s12'>
            <h4 class='row'>
                <span>{!! $default->roomsIcon !!} <b>Bem vindo(a) <span class='blue-text'>{{ Auth::user()->name }}</span></b></span>
            </h4>
            <h5 class='row'>
                <span><b>Estas são as salas disponíveis para você:</b></span>
            </h5>
        @endif
            <div class='divider'></div>
            <div id='public-conference'>
                <!-- Loading de conteúdo -->
                <div class="center blue-text text-darken-2" align='center'>
                    <h5>Encontrando salas...</h5>
                    <a class="btn-floating btn-large blue pulse">{!! $default->searchIcon !!}</a>
                    <br>
                    <br>
                    <br>                                                
                </div>
                <!--Listagem de Salas disponíveis-->
            </div>
        </div>
        @if(Auth::user()->type == 0)
            <div id='teacher-access' class='card z-depth-5 col s12 m6'>
                <div class='card-content'>
                    <div class='card-title black-text'>
                        <h5>{!! $default->tvBlueIcon !!} Iniciar nova sala</h5>
                    </div>
                    <div class='row'>
                        <!--Tema e Assunto da sala-->
                        <div class='input-field col s12'>
                            <input type='text' class='validate' id='tema' name='tema' maxlength="25" required autofocus>
                            <label for='tema'>{!! $default->bookIcon !!} Tema:</label>
                        </div>
                        <div class='input-field col s12'>
                            <input type='text' class='validate' id='assunto' name='assunto' maxlength="25" required>
                            <label for='assunto'>{!! $default->bookmarkIcon !!} Assunto:</label>
                        </div>
                        <div class='input-field col s12'>
                            <select multiple id='cursos-list' required name='cursos-list' title='Selecione ao menos um curso'>
                                @if(isset($cursos))
                                    <option value='' disabled>Selecione ao menos um curso</option>
                                    @foreach($cursos as $curso)
                                        <option value="{{ $curso->id }}">{{ $modulos[$curso->modulo_id] }} {{ $curso->name }}</option>
                                    @endforeach
                                @endif
                            </select>
                            <label for='cursos-list'>{!! $default->cursosIcon !!} Seleção de Cursos</label>
                        </div>
                        <div class='divider'></div>
                        <div align='right'>
                            <button id='btn-conf-devices' class='btn teal white-text waves-effect waves-light modal-trigger' style='display:none;' href='#choose-devices'>{!! $default->configIcon !!} Dispositivos</button>
                            <button type='submit' id='btn-join-as-productor' class='btn blue white-text waves-effect waves-light'>{!! $default->playButtomIcon !!} Iniciar</button>
                        </div>

                        @include('salas._includes.preview')
                        
                    </div> 
                </div>
            </div>
            <input type='hidden' id='target' name='target' disabled readonly />

        @else

            <span id='btn-join-as-productor' class='d-none' readonly disabled></span>
            <input type='hidden' id='target' name='target' readonly disabled value='{{ $turmas->curso_id }}' />

        @endif
        <span id='token' class='d-none' data-content="{{ csrf_token() }}"></span>
    </div>
</div>

<!-- Nome da conexão, tipo e nome do usuário -->
<input type='hidden' id='room-id' name='room-id' value='{{ Auth::user()->login }}-{{ Auth::user()->name }}-{!! rand(0,999) !!}' disabled readonly />
<input type='hidden' id='room-type' name='room-type' value='{{ Auth::user()->type }}' disabled readonly />
<input type='hidden' id='current-user' value='{{ Auth::user()->name }}' disabled readonly />
<!-- ID do broadcaster, sala e tela -->
<input type='hidden' id='broadcaster' name='broadcaster' disabled readonly />
<input type='hidden' id='in-room' name='in-room' disabled readonly />
<input type='hidden' id='in-screen' name='in-screen' disabled readonly />

<!--
<iframe id="embedded_player" style="width:100%;"
    src="http://jitsitutorial443.com:5080/WebRTCApp/play.html?name=Mnw5ODYyc2R3cGplfDE1NDI2NDc1NDkxNzk=" frameborder="0" allowfullscreen>
</iframe>

<script>

    let frame = document.getElementById('embedded_player');
    
    /*
    setTimeout( () => {
        let framePlay = document.getElementById('embedded_player').contentWindow.document.querySelector("button.vjs-big-play-button");
        framePlay.onclick = () =>{
            let viewerPlay = document.getElementById('embedded_player').contentWindow.document.getElementById("remoteVideo_html5_api");
            setTimeout( () => {
                console.log('===>', viewerPlay.videoHeight);
            }, 500);
        }
    }, 5000);
    */

    frame.style.height = '480px';
    
</script>
-->
