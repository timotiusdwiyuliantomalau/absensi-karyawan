<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;

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
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes (authentication required)
Route::middleware('jwt.auth')->group(function () {
    
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // Profile routes
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::post('/change-password', [ProfileController::class, 'changePassword']);
        Route::get('/permissions', [ProfileController::class, 'getPermissions']);
        Route::get('/activity', [ProfileController::class, 'getActivity']);
    });

    // User management routes (admin only)
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
        Route::post('/{id}/activate', [UserController::class, 'activate']);
        Route::post('/{id}/deactivate', [UserController::class, 'deactivate']);
        Route::post('/{id}/password', [UserController::class, 'updatePassword']);
        Route::get('/roles/available', [UserController::class, 'getRoles']);
    });

    // Dashboard routes
    Route::prefix('dashboard')->group(function () {
        Route::get('/', function () {
            return response()->json([
                'success' => true,
                'message' => 'Dashboard accessed successfully',
                'data' => [
                    'user' => auth()->user()->getProfileData(),
                    'timestamp' => now()
                ]
            ]);
        })->middleware('permission:dashboard.view');

        Route::get('/admin', function () {
            return response()->json([
                'success' => true,
                'message' => 'Admin dashboard accessed successfully',
                'data' => [
                    'user' => auth()->user()->getProfileData(),
                    'admin_features' => [
                        'user_management' => true,
                        'role_management' => true,
                        'system_settings' => true
                    ],
                    'timestamp' => now()
                ]
            ]);
        })->middleware('permission:dashboard.admin');
    });

    // Test routes for role and permission checking
    Route::prefix('test')->group(function () {
        Route::get('/role/super-admin', function () {
            return response()->json([
                'success' => true,
                'message' => 'Super Admin role access granted',
                'data' => auth()->user()->getProfileData()
            ]);
        })->middleware('role:Super Admin');

        Route::get('/role/admin', function () {
            return response()->json([
                'success' => true,
                'message' => 'Admin role access granted',
                'data' => auth()->user()->getProfileData()
            ]);
        })->middleware('role:Admin');

        Route::get('/role/manager', function () {
            return response()->json([
                'success' => true,
                'message' => 'Manager role access granted',
                'data' => auth()->user()->getProfileData()
            ]);
        })->middleware('role:Manager');

        Route::get('/permission/user-view', function () {
            return response()->json([
                'success' => true,
                'message' => 'User view permission granted',
                'data' => auth()->user()->getProfileData()
            ]);
        })->middleware('permission:user.view');

        Route::get('/permission/user-create', function () {
            return response()->json([
                'success' => true,
                'message' => 'User create permission granted',
                'data' => auth()->user()->getProfileData()
            ]);
        })->middleware('permission:user.create');
    });
});

// Fallback route for undefined endpoints
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'API endpoint not found',
        'data' => null
    ], 404);
});