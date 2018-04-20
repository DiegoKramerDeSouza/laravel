<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserDadosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_dados', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->integer('school_id');
            $table->enum('group', ['PROFESSOR', 'AUXILIAR', 'CLASSE', 'COORDENADOR']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_dados');
    }
}
