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
                $table->integer('author')->unsigned();
                $table->integer('quantity')->default(0);
                $table->timestamps();
                $table->foreign('author')
                    ->references('id')->on('users')
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
        Schema::dropIfExists('aulas');
    }
}
