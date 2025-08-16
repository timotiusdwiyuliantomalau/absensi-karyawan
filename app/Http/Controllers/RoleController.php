<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Create a new RoleController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('check.permission:role.view');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $roles = Role::with('permissions')->get();

        return response()->json([
            'status' => 'success',
            'data' => $roles
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $this->middleware('check.permission:role.create');

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $role = Role::create(['name' => $request->name]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        $role->load('permissions');

        return response()->json([
            'status' => 'success',
            'message' => 'Role created successfully',
            'data' => $role
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $role = Role::with('permissions')->find($id);

        if (!$role) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $role
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $this->middleware('check.permission:role.edit');

        $role = Role::find($id);

        if (!$role) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role not found'
            ], 404);
        }

        // Prevent modification of Super Admin role
        if ($role->name === 'Super Admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot modify Super Admin role'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:roles,name,' . $id,
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        if ($request->has('name')) {
            $role->update(['name' => $request->name]);
        }

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        $role->load('permissions');

        return response()->json([
            'status' => 'success',
            'message' => 'Role updated successfully',
            'data' => $role
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $this->middleware('check.permission:role.delete');

        $role = Role::find($id);

        if (!$role) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role not found'
            ], 404);
        }

        // Prevent deletion of Super Admin role
        if ($role->name === 'Super Admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot delete Super Admin role'
            ], 403);
        }

        // Check if role is assigned to any users
        if ($role->users()->count() > 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot delete role that is assigned to users'
            ], 400);
        }

        $role->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Role deleted successfully'
        ]);
    }

    /**
     * Get all permissions.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPermissions()
    {
        $permissions = Permission::all();

        return response()->json([
            'status' => 'success',
            'data' => $permissions
        ]);
    }

    /**
     * Assign role to user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function assignRole(Request $request)
    {
        $this->middleware('check.permission:role.assign');

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = \App\Models\User::find($request->user_id);
        $user->syncRoles($request->roles);

        return response()->json([
            'status' => 'success',
            'message' => 'Roles assigned successfully',
            'data' => [
                'user' => $user->load('roles', 'permissions')
            ]
        ]);
    }
}