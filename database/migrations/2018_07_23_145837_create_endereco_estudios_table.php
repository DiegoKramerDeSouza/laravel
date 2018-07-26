<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEnderecoEstudiosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('endereco_estudios')){
            Schema::create('endereco_estudios', function (Blueprint $table) {
                $table->increments('id');
                $table->string('postal', 9);
                $table->string('address');
                $table->string('city');
                $table->integer('number');          
                $table->string('complement')->nullable();
                $table->string('st');
                $table->integer('estudio_id')->unsigned();
                $table->foreign('estudio_id')
                    ->references('id')->on('estudios')
                    ->onDelete('cascade');
                $table->timestamps();
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
        Schema::dropIfExists('endereco_estudios');
    }
}
