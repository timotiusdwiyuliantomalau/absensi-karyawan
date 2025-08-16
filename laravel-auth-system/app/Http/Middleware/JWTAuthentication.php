<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\JWTException;

class JWTAuthentication
{
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

            $request->merge(['user' => $user]);
            
            // Update last login info
            $user->update([
                'last_login_at' => now(),
                'last_login_ip' => $request->ip(),
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