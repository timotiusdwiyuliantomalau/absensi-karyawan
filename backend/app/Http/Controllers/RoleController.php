<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use App\Http\Resources\RoleResource;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $query = Role::query()->when($request->search, function($q,$s){
            $q->where('name','like',"%$s%");
        })->orderBy($request->get('sort','name'), $request->get('dir','asc'));
        return RoleResource::collection($query->paginate(10));
    }

    public function store(Request $request)
    {
        $data = $request->validate(['name' => 'required|string|unique:roles,name']);
        $role = Role::create(['name' => $data['name'], 'guard_name' => 'web']);
        return new RoleResource($role);
    }

    public function show(Role $role)
    {
        return new RoleResource($role);
    }

    public function update(Request $request, Role $role)
    {
        $data = $request->validate(['name' => 'required|string|unique:roles,name,'.$role->id]);
        $role->update(['name' => $data['name']]);
        return new RoleResource($role);
    }

    public function destroy(Role $role)
    {
        $role->delete();
        return response()->noContent();
    }
}
