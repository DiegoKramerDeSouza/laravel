<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserDado extends Model
{
    protected $fillable = [
        'id', 'user_id', 'school_id', 'perfils_id', 'group'
    ];
}
