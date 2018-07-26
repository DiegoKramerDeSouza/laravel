<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAulasHasCursosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('aulas_has_cursos')){
            Schema::create('aulas_has_cursos', function (Blueprint $table) {
                $table->primary(['aula_id', 'curso_id']);
                $table->integer('aula_id')->unsigned();
                $table->integer('curso_id')->unsigned();
                $table->foreign('aula_id')
                    ->references('id')->on('aulas')
                    ->onDelete('cascade');
                $table->foreign('curso_id')
                    ->references('id')->on('cursos')
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
        Schema::dropIfExists('aulas_has_cursos');
    }
}
