<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;

class JWTAuthentication
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ], 401);
            }

            if (!$user->isActive()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User account is deactivated'
                ], 401);
            }

            // Add user to request
            $request->merge(['user' => $user]);
            
            // Update last login
            $user->update([
                'last_login_at' => now(),
                'last_login_ip' => $request->ip()
            ]);

        } catch (TokenExpiredException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token has expired'
            ], 401);
        } catch (TokenInvalidException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token is invalid'
            ], 401);
        } catch (JWTException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token is required'
            ], 401);
        }

        return $next($request);
    }
}