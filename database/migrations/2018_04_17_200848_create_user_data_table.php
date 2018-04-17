<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_data', function (Blueprint $table) {
            $table->increments('id');
            $table->string('user_id');
            $table->integer('school_id');
            $table->string('group');
            $table->timestamps();
            
        });
        /*
        Schema::table('user_data', function (Blueprint $table){
            $table->foreign('school_id')->references('id')->on('escolas');
            $table->foreign('user_id')->references('id')->on('users');
        });
        */
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_data');
    }
}
