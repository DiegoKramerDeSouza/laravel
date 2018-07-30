<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTurmasHasAulasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('turmas_has_aulas')){
            Schema::create('turmas_has_aulas', function (Blueprint $table) {
                $table->primary(['turma_id', 'aula_id']);
                $table->integer('turma_id')->unsigned();
                $table->integer('aula_id')->unsigned();
                $table->foreign('turma_id')
                    ->references('id')->on('turmas')
                    ->onDelete('cascade');
                $table->foreign('aula_id')
                    ->references('id')->on('aulas')
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
        Schema::dropIfExists('turmas_has_aulas');
    }
}
