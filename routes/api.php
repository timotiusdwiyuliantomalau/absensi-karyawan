<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

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
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes (authentication required)
Route::middleware(['jwt.auth'])->group(function () {
    
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
    });

    // User management routes (admin only)
    Route::middleware(['check.role:admin'])->prefix('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
        Route::post('/users/{user}/change-password', [UserController::class, 'changeUserPassword']);
        Route::post('/users/{user}/toggle-status', [UserController::class, 'toggleStatus']);
        Route::get('/users/statistics', [UserController::class, 'statistics']);
    });

    // Moderator routes
    Route::middleware(['check.role:admin,moderator'])->prefix('moderator')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::put('/users/{user}', [UserController::class, 'update']);
    });

    // User routes (basic user access)
    Route::middleware(['check.role:user,moderator,admin'])->prefix('user')->group(function () {
        // Add your application-specific routes here
        Route::get('/dashboard', function () {
            return response()->json([
                'status' => 'success',
                'message' => 'Welcome to user dashboard',
                'user' => auth()->user()
            ]);
        });
    });

    // Example of permission-based routes
    Route::middleware(['check.permission:manage_users'])->group(function () {
        Route::get('/admin/users/manage', function () {
            return response()->json([
                'status' => 'success',
                'message' => 'User management access granted'
            ]);
        });
    });

    Route::middleware(['check.permission:delete'])->group(function () {
        Route::get('/admin/delete-access', function () {
            return response()->json([
                'status' => 'success',
                'message' => 'Delete permission access granted'
            ]);
        });
    });
});

// Health check route
Route::get('/health', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'API is running',
        'timestamp' => now()->toISOString()
    ]);
});

// Fallback route
Route::fallback(function () {
    return response()->json([
        'status' => 'error',
        'message' => 'Route not found'
    ], 404);
});