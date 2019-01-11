<!-- Resposta de tratamento da validação de campos -->
@if ($errors->any())
    <div class="row input-field blockquoted-red">
        <div class="col s12">
            <ul class="red-text text-darken-3">
                @foreach ($errors->all() as $error)
                    <li><b>{!! $default->cancelIcon !!} {{ $error }}</b></li>
                @endforeach
            </ul>
        </div>
    </div>
@endif