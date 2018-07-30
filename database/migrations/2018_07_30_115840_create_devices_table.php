<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDevicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('devices')){
            Schema::create('devices', function (Blueprint $table) {
                $table->increments('id');
                $table->string('aud_label');
                $table->string('aud_id');
                $table->string('aud_group_id');
                $table->string('vid_label');
                $table->string('vid_id');
                $table->string('vid_group_id');
                $table->integer('user_dados_id')->unsigned();
                $table->integer('user_dados_users_id')->unsigned();
                $table->integer('user_dados_perfis_id')->unsigned();
                $table->timestamps();
                $table->foreign('user_dados_id')
                    ->references('id')->on('user_dados')
                    ->onDelete('cascade');
                $table->foreign('user_dados_users_id')
                    ->references('user_id')->on('user_dados')
                    ->onDelete('cascade');
                $table->foreign('user_dados_perfils_id')
                    ->references('perfils_id')->on('user_dados')
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
        Schema::dropIfExists('devices');
    }
}
