<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$permissions): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 401);
        }

        // Check if user has any of the required permissions
        if (!$user->hasAnyPermission($permissions)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Insufficient permissions. Required permissions: ' . implode(', ', $permissions)
            ], 403);
        }

        return $next($request);
    }
}