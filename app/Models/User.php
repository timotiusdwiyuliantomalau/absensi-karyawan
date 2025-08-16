<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
        'is_active',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
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

    /**
     * Check if user has specific permission
     *
     * @param string $permission
     * @return bool
     */
    public function hasPermission($permission)
    {
        return $this->hasPermissionTo($permission);
    }

    /**
     * Check if user has any of the given permissions
     *
     * @param array $permissions
     * @return bool
     */
    public function hasAnyPermission($permissions)
    {
        return $this->hasAnyPermission($permissions);
    }

    /**
     * Check if user has all of the given permissions
     *
     * @param array $permissions
     * @return bool
     */
    public function hasAllPermissions($permissions)
    {
        return $this->hasAllPermissions($permissions);
    }

    /**
     * Get user's active status
     *
     * @return bool
     */
    public function isActive()
    {
        return $this->is_active;
    }

    /**
     * Activate user
     *
     * @return bool
     */
    public function activate()
    {
        $this->update(['is_active' => true]);
        return true;
    }

    /**
     * Deactivate user
     *
     * @return bool
     */
    public function deactivate()
    {
        $this->update(['is_active' => false]);
        return true;
    }
}