@include('admin.cadastro._includes.alert')
<div class='row'>
    <div class='input-field col s12 m6'>
        <input class='validate' required type='text' name='name' id='name' value='{{ isset($modulos->name) ? $modulos->name : ''}}'>
        <label for='name'>{!! $default->modulosIcon !!} Nome do módulo</label>
    </div>
</div>