<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\UserResource;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()->when($request->search, function($q,$s){
            $q->where(function($sub) use ($s){
                $sub->where('name','like',"%$s%")->orWhere('email','like',"%$s%");
            });
        })->orderBy($request->get('sort','name'), $request->get('dir','asc'));
        return UserResource::collection($query->paginate(10));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'roles' => 'array',
        ]);
        $user = new User();
        $user->fill([
            'uuid' => (string) Str::uuid(),
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'is_active' => true,
        ]);
        $user->save();
        if (!empty($data['roles'])) {
            $user->syncRoles($data['roles']);
        }
        return new UserResource($user);
    }

    public function show(User $user)
    {
        return new UserResource($user);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => ['required','email', Rule::unique('users','email')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
            'is_active' => 'boolean',
            'roles' => 'array',
        ]);
        $user->name = $data['name'];
        $user->email = $data['email'];
        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
        if (array_key_exists('is_active',$data)) {
            $user->is_active = $data['is_active'];
        }
        $user->save();
        if (isset($data['roles'])) {
            $user->syncRoles($data['roles']);
        }
        return new UserResource($user);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->noContent();
    }
}
