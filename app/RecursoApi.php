<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RecursoApi extends Model
{
    protected $fillable = [
        'id', 'name', 'key', 'details',
    ];
}
