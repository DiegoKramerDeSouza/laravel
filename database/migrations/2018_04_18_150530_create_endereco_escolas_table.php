<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEnderecoEscolasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('endereco_escolas')){
            Schema::create('endereco_escolas', function (Blueprint $table) {
                $table->increments('id');
                $table->integer('school_id')->unsigned();
                $table->string('postal', 9);
                $table->string('address');
                $table->string('city');
                $table->integer('number');          
                $table->string('complement')->nullable();
                $table->string('st');
                $table->string('coordinates')->nullable();
                $table->timestamps();
                $table->foreign('school_id')
                    ->references('id')->on('escolas')
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
        Schema::dropIfExists('endereco_escolas');
    }
}
