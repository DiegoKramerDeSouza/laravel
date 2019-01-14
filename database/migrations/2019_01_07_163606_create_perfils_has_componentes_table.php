<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePerfilsHasComponentesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('perfils_has_componentes', function (Blueprint $table) {
            $table->primary(['perfils_id', 'componentes_id']);
            $table->integer('perfils_id')->unsigned();
            $table->integer('componentes_id')->unsigned();
            $table->timestamps();
            $table->foreign('perfils_id')
                ->references('id')->on('perfils')
                ->onDelete('cascade');
            $table->foreign('componentes_id')
                ->references('id')->on('componentes')
                ->onDelete('cascade');
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('perfils_has_componentes');
    }
}
