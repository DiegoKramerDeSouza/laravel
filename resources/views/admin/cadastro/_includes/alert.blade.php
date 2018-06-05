@if ($errors->any())
    <div class="row input-field blockquoted-red">
        <div class="col s12">
            <ul class="red-text text-darken-3">
                @foreach ($errors->all() as $error)
                    <li><b><i class="fa fa-times"></i> {{ $error }}</b></li>
                @endforeach
            </ul>
        </div>
    </div>
@endif