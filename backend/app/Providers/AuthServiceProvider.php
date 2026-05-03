<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Approval;
use App\Policies\ApprovalPolicy;

class AuthServiceProvider extends ServiceProvider

{

    protected $policies = [
         Approval::class => ApprovalPolicy::class,
    ];
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
