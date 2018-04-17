<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEscolaEnderecoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('escola_endereco', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('school_id');
            $table->decimal('postal', 8, 3);
            $table->string('address');
            $table->string('city');
            $table->char('st', 2);
            $table->string('complement');
            $table->string('location')->nullable();
            $table->timestamps();
            
        });
        /*
        Schema::table('escola_endereco', function (Blueprint $table){
            $table->foreign('school_id')->references('id')->on('escolas');
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
        Schema::dropIfExists('escola_endereco');
    }
}
