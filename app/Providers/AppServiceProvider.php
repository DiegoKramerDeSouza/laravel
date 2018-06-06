<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Schema::defaultStringLength(191);
        /**
         *  Constantes disponíveis para todas as Views
         * 
         */
        // Definição de UFs
        view()->share('ufs', ['AC'=>'Acre','AL'=>'Alagoas','AP'=>'Amapá','AM'=>'Amazonas','BA'=>'Bahia','CE'=>'Ceará',
        'DF'=>'Distrito Federal','ES'=>'Espírito Santo','GO'=>'Goiás','MA'=>'Maranhão','MT'=>'Mato Grosso',
        'MS'=>'Mato Grosso do Sul','MG'=>'Minas Gerais','PA'=>'Pará','PB'=>'Paraíba','PR'=>'Paraná',
        'PE'=>'Pernambuco','PI'=>'Piauí','RJ'=>'Rio de Janeiro','RN'=>'Rio Grande do Norte',
        'RS'=>'Rio Grande do Sul','RO'=>'Rondônia','RR'=>'Roraima','SC'=>'Santa Catarina','SP'=>'São Paulo',
        'SE'=>'Sergipe','TO'=>'Tocantins']);

        // Definição do nome da aplicação
        view()->share('logo', 'WebTV');

        // Definição de ícones para todas as views
        // -> Ícones utilizados: FontAwesome e MaterializeCSS
        // MaterializeCSS Icons
        view()->share('controlLargeIcon',           "<i class='material-icons large'>dvr</i>");
        view()->share('forumIcon',                  "<i class='material-icons'>forum</i>");
        view()->share('fullscreenExitLargeIcon',    "<i class='material-icons large'>fullscreen_exit</i>");
        view()->share('fullscreenIcon',             "<i class='material-icons'>fullscreen</i>");
        view()->share('micIcon',                    "<i class='material-icons'>mic</i>");
        view()->share('panToolBlueIcon',            "<i class='material-icons blue-text'>pan_tool</i>");
        view()->share('panToolIcon',                "<i class='material-icons'>pan_tool</i>");
        view()->share('peopleLargeIcon',            "<i class='material-icons large'>people_outline</i>");
        view()->share('searchIcon',                 "<i class='material-icons'>search</i>");
        view()->share('screenShareIcon',            "<i class='material-icons'>screen_share</i>");
        view()->share('sendIcon',                   "<i class='material-icons'>send</i>");
        view()->share('shareLargeIcon',             "<i class='material-icons large'>share</i>");
        view()->share('swapIcon',                   "<i class='material-icons'>swap_horiz</i>");
        view()->share('transmitLargeIcon',          "<i class='material-icons large'>wifi_tethering</i>");
        view()->share('tvBlueIcon',                 "<i class='material-icons blue-text'>live_tv</i>");
        view()->share('tvIcon',                     "<i class='material-icons'>live_tv</i>");
        view()->share('userVideoBlueIcon',          "<i class='material-icons blue-text'>ondemand_video</i>");
        view()->share('videocamIcon',               "<i class='material-icons'>videocam</i>");
        view()->share('videocamLargeIcon',          "<i class='material-icons large'>videocam</i>");
        view()->share('volumeUpIcon',               "<i class='material-icons'>volume_up</i>");
        // FontAwesome Icons
        view()->share('loginIcon', "<i class='fa fa-user-circle fa-lg'></i>");
        view()->share('loginBlueIcon', "<i class='fa fa-user-circle fa-lg blue-text'></i>");
        view()->share('userIcon', "<i class='fa fa-user fa-lg'></i>");
        view()->share('userOIcon', "<i class='fa fa-user-o fa-lg'></i>");
        view()->share('lockIcon', "<i class='fa fa-lock fa-lg'></i>");
        view()->share('signInIcon', "<i class='fa fa-sign-in fa-lg'></i>");
        view()->share('signOutRedIcon', "<i class='fa fa-sign-out fa-lg red-text'></i>");
        view()->share('firefoxIcon', "<i class='fa fa-firefox'></i>");
        view()->share('chromeIcon', "<i class='fa fa-chrome'></i>");
        view()->share('copyRightIcon', "<i class='fa fa-copyright'></i>");
        view()->share('menuIcon', "<i class='fa fa-bars fa-2x'></i>");
        view()->share('homeIcon', "<i class='fa fa-home fa-lg'></i>");
        view()->share('homeBlueIcon', "<span class='fa fa-home fa-lg blue-text'></span>");
        view()->share('roomsIcon', "<span class='fa fa-television fa-lg'></span>");
        view()->share('roomsBlueIcon', "<span class='fa fa-television fa-lg blue-text'></span>");
        view()->share('userPlusBlueIcon', "<span class='fa fa-user-plus fa-lg blue-text'></span>");
        view()->share('configBlueIcon', "<i class='fa fa-cog blue-text'></i>");
        view()->share('bookmarkIcon', "<i class='fa fa-bookmark'></i>");
        view()->share('bookIcon', "<i class='fa fa-book'></i>");
        view()->share('bookBlueIcon', "<i class='fa fa-book blue-text'></i>");
        view()->share('cursosIcon', "<i class='fa fa-cubes'></i>");
        view()->share('playButtomIcon', "<i class='fa fa-play-circle'></i>");

        view()->share('institutionIcon', "<i class='fa fa-institution fa-lg'></i>");
        view()->share('modulosIcon', "<i class='fa fa-database fa-lg'></i>");
        view()->share('cursosIcon', "<i class='fa fa-cubes fa-lg'></i>");
        view()->share('turmasIcon', "<i class='fa fa-graduation-cap fa-lg'></i>");
        view()->share('perfisIcon', "<i class='fa fa-vcard-o fa-lg'></i>");
        view()->share('usuariosIcon', "<i class='fa fa-users fa-lg'></i>");
        view()->share('timeIcon', "<i class='fa fa-clock-o fa-lg'></i>");
        view()->share('novoIcon', "<i class='fa fa-plus-circle fa-lg'></i>");
        view()->share('warningIcon', "<i class='fa fa-exclamation-triangle fa-lg'></i>");
        view()->share('envelopeIcon', "<i class='fa fa-envelope-o fa-lg'></i>");
        view()->share('enderecoIcon', "<i class='fa fa-map-marker fa-lg'></i>");
        view()->share('mapIcon', "<i class='fa fa-map-o fa-lg'></i>");
        view()->share('numeroIcon', "<i class='fa fa-tag fa-lg'></i>");
        view()->share('plusIcon', "<i class='fa fa-plus-square-o fa-lg'></i>");
        view()->share('globoIcon', "<i class='fa fa-globe fa-lg'></i>");
        view()->share('descricaoIcon', "<i class='fa fa-commenting-o fa-lg'></i>");
        view()->share('acessosIcon', "<i class='fa fa-shield fa-lg'></i>");

        view()->share('institutionLargeIcon', "<i class='fa fa-institution fa-2x'></i>");
        view()->share('modulosLargeIcon', "<i class='fa fa-database fa-2x'></i>");
        view()->share('cursosLargeIcon', "<i class='fa fa-cubes fa-2x'></i>");
        view()->share('turmasLargeIcon', "<i class='fa fa-graduation-cap fa-2x'></i>");
        view()->share('perfisLargeIcon', "<i class='fa fa-vcard-o fa-2x'></i>");
        view()->share('usuariosLargeIcon', "<i class='fa fa-users fa-2x'></i>");

        view()->share('prefixCommentingIcon', "<i class='fa fa-commenting-o fa-1x prefix'></i>");
        view()->share('prefixSearchIcon', "<i class='material-icons prefix'>search</i>");
        
        view()->share('deleteIcon', "<i class='fa fa-trash-o'></i>");
        view()->share('editIcon', "<i class='fa fa-pencil'></i>");
        view()->share('applyIcon', "<i class='fa fa-check'></i>");
        view()->share('cancelIcon', "<i class='fa fa-times'></i>");
        view()->share('cancelRedIcon', "<i class='fa fa-times red-text text-darken-3'></i>");        
        view()->share('closeIcon', "<i class='fa fa-times-circle'></i>");
        view()->share('closeLargeIcon', "<i class='fa fa-times-circle fa-3x'></i>");
        view()->share('gobackLink', "<i class='fa fa-arrow-left'></i> voltar");
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
        
    }
}
