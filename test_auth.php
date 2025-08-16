<?php

require_once 'vendor/autoload.php';

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// Bootstrap Laravel
$app = Application::configure(basePath: __DIR__)
    ->withRouting(
        web: __DIR__.'/routes/web.php',
        commands: __DIR__.'/routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'jwt.auth' => \App\Http\Middleware\JWTAuthentication::class,
            'check.role' => \App\Http\Middleware\CheckRole::class,
            'check.permission' => \App\Http\Middleware\CheckPermission::class,
            'rate.limit' => \App\Http\Middleware\RateLimitMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

echo "Laravel application bootstrapped successfully!\n";
echo "Testing basic functionality...\n";

// Test database connection
try {
    $db = $app->make('db');
    $connection = $db->connection();
    echo "Database connection: OK\n";
} catch (Exception $e) {
    echo "Database connection: FAILED - " . $e->getMessage() . "\n";
}

// Test JWT configuration
try {
    $jwtConfig = config('jwt');
    echo "JWT configuration: OK\n";
} catch (Exception $e) {
    echo "JWT configuration: FAILED - " . $e->getMessage() . "\n";
}

echo "Test completed!\n";