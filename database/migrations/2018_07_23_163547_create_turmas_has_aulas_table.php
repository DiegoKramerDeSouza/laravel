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
                $table->primary(['user_id', 'aula_id']);
                $table->integer('user_id')->unsigned();
                $table->integer('aula_id')->unsigned();
                $table->integer('qtd')->default(0);
                $table->timestamps();
                $table->foreign('user_id')
                    ->references('id')->on('users')
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
