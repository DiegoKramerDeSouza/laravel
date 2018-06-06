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
        // Constantes disponíveis para todas as Views
        view()->share('ufs', ['AC'=>'Acre','AL'=>'Alagoas','AP'=>'Amapá','AM'=>'Amazonas','BA'=>'Bahia','CE'=>'Ceará',
        'DF'=>'Distrito Federal','ES'=>'Espírito Santo','GO'=>'Goiás','MA'=>'Maranhão','MT'=>'Mato Grosso',
        'MS'=>'Mato Grosso do Sul','MG'=>'Minas Gerais','PA'=>'Pará','PB'=>'Paraíba','PR'=>'Paraná',
        'PE'=>'Pernambuco','PI'=>'Piauí','RJ'=>'Rio de Janeiro','RN'=>'Rio Grande do Norte',
        'RS'=>'Rio Grande do Sul','RO'=>'Rondônia','RR'=>'Roraima','SC'=>'Santa Catarina','SP'=>'São Paulo',
        'SE'=>'Sergipe','TO'=>'Tocantins']);
        view()->share('logo', 'WebTv');
        // Definição de ícones para todas as views
        view()->share('deleteIcon', "<i class='fa fa-trash-o'></i>");
        view()->share('editIcon', "<i class='fa fa-pencil'></i>");
        view()->share('applyIcon', "<i class='fa fa-check'></i>");
        view()->share('cancelIcon', "<i class='fa fa-times'></i>");
        view()->share('gobackLink', "<i class='fa fa-arrow-left'></i> voltar");
        view()->share('pagination', 5);

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
