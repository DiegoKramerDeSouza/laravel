
<h3>Salas</h3>
@foreach($salas as $sala)
    <p>{{ $sala->numero }}: {{ $sala->status }}</p>
@endforeach