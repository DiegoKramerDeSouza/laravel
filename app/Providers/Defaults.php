<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\DefaultElements;

class Defaults extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        /**
         *  Implementação de DefaultElements em $default, disponível para todas as Views
         */
        $object = new DefaultElements();
        view()->share('default', $object);

    }
}
