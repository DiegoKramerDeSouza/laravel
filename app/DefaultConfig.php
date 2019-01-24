<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DefaultConfig extends Model
{
    //
    public function __construct(){

        $this->pagination = 10;
    }
}
