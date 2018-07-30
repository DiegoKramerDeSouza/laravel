<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    protected $fillable = [
        'id', 'aud_label', 'aud_id', 'aud_group_id', 'vid_label', 'vid_id', 'vid_group_id', 'user_dados_id', 'user_dados_users_id', 'user_dados_perfis_id'
    ];
}
