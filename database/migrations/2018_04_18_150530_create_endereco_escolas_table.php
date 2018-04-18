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
        Schema::create('endereco_escolas', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('school_id');
            $table->decimal('postal', 8,3);
            $table->string('address');
            $table->string('complement')->nullable();
            $table->string('st');
            $table->string('coordinates');
            $table->timestamps();
        });
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
