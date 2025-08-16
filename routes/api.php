<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes (no authentication required)
Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
});

// Protected routes (authentication required)
Route::group(['middleware' => ['jwt.auth', 'rate.limit:60,1']], function () {
    
    // Auth routes
    Route::group(['prefix' => 'auth'], function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('me', [AuthController::class, 'me']);
        Route::post('change-password', [AuthController::class, 'changePassword']);
    });

    // User management routes
    Route::group(['prefix' => 'users'], function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
        Route::post('/{id}/activate', [UserController::class, 'activate']);
        Route::post('/{id}/deactivate', [UserController::class, 'deactivate']);
        Route::get('/roles/available', [UserController::class, 'getRoles']);
        Route::put('/profile/update', [UserController::class, 'updateProfile']);
    });

    // Role management routes
    Route::group(['prefix' => 'roles'], function () {
        Route::get('/', [RoleController::class, 'index']);
        Route::post('/', [RoleController::class, 'store']);
        Route::get('/{id}', [RoleController::class, 'show']);
        Route::put('/{id}', [RoleController::class, 'update']);
        Route::delete('/{id}', [RoleController::class, 'destroy']);
        Route::get('/permissions/available', [RoleController::class, 'getPermissions']);
        Route::post('/assign', [RoleController::class, 'assignRole']);
    });

    // Admin only routes
    Route::group(['middleware' => 'check.role:Super Admin,Admin'], function () {
        Route::get('/admin/dashboard', function () {
            return response()->json([
                'status' => 'success',
                'message' => 'Welcome to Admin Dashboard',
                'data' => [
                    'total_users' => \App\Models\User::count(),
                    'active_users' => \App\Models\User::where('is_active', true)->count(),
                    'total_roles' => \Spatie\Permission\Models\Role::count(),
                    'total_permissions' => \Spatie\Permission\Models\Permission::count(),
                ]
            ]);
        });
    });

    // Manager routes
    Route::group(['middleware' => 'check.role:Super Admin,Admin,Manager'], function () {
        Route::get('/manager/dashboard', function () {
            return response()->json([
                'status' => 'success',
                'message' => 'Welcome to Manager Dashboard',
                'data' => [
                    'total_users' => \App\Models\User::count(),
                    'active_users' => \App\Models\User::where('is_active', true)->count(),
                ]
            ]);
        });
    });

    // User routes
    Route::group(['middleware' => 'check.role:Super Admin,Admin,Manager,User'], function () {
        Route::get('/user/dashboard', function () {
            $user = auth()->user();
            return response()->json([
                'status' => 'success',
                'message' => 'Welcome to User Dashboard',
                'data' => [
                    'user' => $user->only(['id', 'name', 'email', 'phone', 'address']),
                    'roles' => $user->roles->pluck('name'),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                ]
            ]);
        });
    });

    // Guest routes
    Route::group(['middleware' => 'check.role:Super Admin,Admin,Manager,User,Guest'], function () {
        Route::get('/public/content', function () {
            return response()->json([
                'status' => 'success',
                'message' => 'Public content accessible to all authenticated users',
                'data' => [
                    'content' => 'This is public content that all authenticated users can access.',
                    'timestamp' => now(),
                ]
            ]);
        });
    });

    // Permission-based routes
    Route::group(['middleware' => 'check.permission:content.create'], function () {
        Route::post('/content', function (Request $request) {
            return response()->json([
                'status' => 'success',
                'message' => 'Content created successfully',
                'data' => [
                    'content' => $request->input('content'),
                    'created_by' => auth()->user()->name,
                    'created_at' => now(),
                ]
            ]);
        });
    });

    Route::group(['middleware' => 'check.permission:content.edit'], function () {
        Route::put('/content/{id}', function (Request $request, $id) {
            return response()->json([
                'status' => 'success',
                'message' => 'Content updated successfully',
                'data' => [
                    'id' => $id,
                    'content' => $request->input('content'),
                    'updated_by' => auth()->user()->name,
                    'updated_at' => now(),
                ]
            ]);
        });
    });

    Route::group(['middleware' => 'check.permission:content.delete'], function () {
        Route::delete('/content/{id}', function ($id) {
            return response()->json([
                'status' => 'success',
                'message' => 'Content deleted successfully',
                'data' => [
                    'id' => $id,
                    'deleted_by' => auth()->user()->name,
                    'deleted_at' => now(),
                ]
            ]);
        });
    });

    // System routes (Super Admin only)
    Route::group(['middleware' => 'check.role:Super Admin'], function () {
        Route::get('/system/info', function () {
            return response()->json([
                'status' => 'success',
                'message' => 'System Information',
                'data' => [
                    'laravel_version' => app()->version(),
                    'php_version' => phpversion(),
                    'server_info' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
                    'database_connection' => config('database.default'),
                    'cache_driver' => config('cache.default'),
                    'session_driver' => config('session.driver'),
                    'queue_driver' => config('queue.default'),
                    'timezone' => config('app.timezone'),
                    'locale' => config('app.locale'),
                    'debug_mode' => config('app.debug'),
                    'environment' => config('app.env'),
                ]
            ]);
        });

        Route::get('/system/logs', function () {
            return response()->json([
                'status' => 'success',
                'message' => 'System Logs',
                'data' => [
                    'note' => 'This endpoint would typically return system logs',
                    'timestamp' => now(),
                ]
            ]);
        });
    });
});

// Health check route
Route::get('/health', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'API is running',
        'timestamp' => now(),
        'version' => '1.0.0'
    ]);
});

// Fallback route for undefined endpoints
Route::fallback(function () {
    return response()->json([
        'status' => 'error',
        'message' => 'Endpoint not found',
        'code' => 404
    ], 404);
});