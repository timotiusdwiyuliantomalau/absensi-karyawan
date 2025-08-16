<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
        'is_active',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'user_id' => $this->id,
            'email' => $this->email,
            'name' => $this->name,
            'roles' => $this->roles->pluck('name'),
            'permissions' => $this->getAllPermissions()->pluck('name'),
        ];
    }

    public function hasPermission($permission)
    {
        return $this->hasPermissionTo($permission);
    }

    public function hasAnyPermission($permissions)
    {
        return $this->hasAnyPermission($permissions);
    }

    public function hasAllPermissions($permissions)
    {
        return $this->hasAllPermissions($permissions);
    }

    public function isActive()
    {
        return $this->is_active;
    }

    public function activate()
    {
        $this->update(['is_active' => true]);
        return true;
    }

    public function deactivate()
    {
        $this->update(['is_active' => false]);
        return true;
    }
}
