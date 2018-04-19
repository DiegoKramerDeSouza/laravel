<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserDado extends Model
{
    protected $fillable = [
        'id', 'user_id', 'escola_id', 'group'
    ];
}
