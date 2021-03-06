<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTurmasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('turmas')){
            Schema::create('turmas', function (Blueprint $table) {
                $table->increments('id');
                $table->string('name');
                $table->integer('user_id')->unsigned();
                $table->integer('school_id')->unsigned();
                $table->string('school_name');
                $table->string('curso_id');
                $table->string('description')->nullable();
                $table->timestamps();
                $table->foreign('user_id')
                    ->references('id')->on('users')
                    ->onDelete('cascade');
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
        Schema::dropIfExists('turmas');
    }
}
