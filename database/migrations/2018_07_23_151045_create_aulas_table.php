<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAulasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('aulas')){
            Schema::create('aulas', function (Blueprint $table) {
                $table->increments('id');
                $table->string('hash')->unique();
                $table->string('name');
                $table->string('theme');
                $table->string('author');
                $table->integer('quantity')->default(0);
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
        Schema::dropIfExists('aulas');
    }
}
