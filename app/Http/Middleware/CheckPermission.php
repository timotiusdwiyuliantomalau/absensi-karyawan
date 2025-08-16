<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$permissions): Response
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Please login first.',
                'data' => null
            ], 401);
        }

        $user = Auth::user();

        // Check if user is active
        if (!$user->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'Account is deactivated. Please contact administrator.',
                'data' => null
            ], 403);
        }

        // Check if user has any of the required permissions
        if (!empty($permissions)) {
            $hasPermission = false;
            foreach ($permissions as $permission) {
                if ($user->hasPermission($permission)) {
                    $hasPermission = true;
                    break;
                }
            }

            if (!$hasPermission) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Insufficient permissions.',
                    'data' => null
                ], 403);
            }
        }

        return $next($request);
    }
}