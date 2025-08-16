<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    /**
     * Create a new ProfileController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api');
        $this->middleware('permission:profile.view')->only(['show']);
        $this->middleware('permission:profile.edit')->only(['update']);
        $this->middleware('permission:profile.change-password')->only(['changePassword']);
    }

    /**
     * Display the authenticated user's profile.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function show()
    {
        $user = Auth::user();
        
        return response()->json([
            'success' => true,
            'message' => 'Profile retrieved successfully',
            'data' => $user->getProfileData()
        ]);
    }

    /**
     * Update the authenticated user's profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'data' => $validator->errors()
            ], 422);
        }

        $user->update($request->only(['name', 'phone', 'address']));

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $user->getProfileData()
        ]);
    }

    /**
     * Change the authenticated user's password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'data' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();

        // Check current password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect',
                'data' => null
            ], 400);
        }

        // Update password
        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully',
            'data' => null
        ]);
    }

    /**
     * Get the authenticated user's permissions.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPermissions()
    {
        $user = Auth::user();
        
        return response()->json([
            'success' => true,
            'message' => 'Permissions retrieved successfully',
            'data' => [
                'roles' => $user->roles->pluck('name'),
                'permissions' => $user->getAllPermissions()->pluck('name'),
                'direct_permissions' => $user->getDirectPermissions()->pluck('name')
            ]
        ]);
    }

    /**
     * Get the authenticated user's activity.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getActivity()
    {
        $user = Auth::user();
        
        return response()->json([
            'success' => true,
            'message' => 'Activity retrieved successfully',
            'data' => [
                'last_login_at' => $user->last_login_at,
                'last_login_ip' => $user->last_login_ip,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'email_verified_at' => $user->email_verified_at
            ]
        ]);
    }
}