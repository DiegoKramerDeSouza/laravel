<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCursosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('cursos')){
            Schema::create('cursos', function (Blueprint $table) {
                $table->increments('id');
                $table->string('name')->unique();
                $table->integer('modulo_id')->unsigned();
                $table->timestamps();
                $table->foreign('modulo_id')
                    ->references('id')->on('modulos')
                    ->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cursos');
    }
}
