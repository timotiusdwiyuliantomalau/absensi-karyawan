<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // User management
            'user.view',
            'user.create',
            'user.edit',
            'user.delete',
            'user.activate',
            'user.deactivate',
            
            // Role management
            'role.view',
            'role.create',
            'role.edit',
            'role.delete',
            'role.assign',
            
            // Permission management
            'permission.view',
            'permission.create',
            'permission.edit',
            'permission.delete',
            'permission.assign',
            
            // Profile management
            'profile.view',
            'profile.edit',
            'profile.change-password',
            
            // Dashboard
            'dashboard.view',
            'dashboard.admin',
            
            // System settings
            'settings.view',
            'settings.edit',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create roles and assign permissions
        $superAdmin = Role::create(['name' => 'Super Admin', 'guard_name' => 'web']);
        $admin = Role::create(['name' => 'Admin', 'guard_name' => 'web']);
        $manager = Role::create(['name' => 'Manager', 'guard_name' => 'web']);
        $user = Role::create(['name' => 'User', 'guard_name' => 'web']);

        // Super Admin gets all permissions
        $superAdmin->givePermissionTo(Permission::all());

        // Admin gets most permissions except super admin specific ones
        $admin->givePermissionTo([
            'user.view', 'user.create', 'user.edit', 'user.activate', 'user.deactivate',
            'role.view', 'role.assign',
            'permission.view',
            'profile.view', 'profile.edit', 'profile.change-password',
            'dashboard.view', 'dashboard.admin',
            'settings.view', 'settings.edit'
        ]);

        // Manager gets limited permissions
        $manager->givePermissionTo([
            'user.view',
            'profile.view', 'profile.edit', 'profile.change-password',
            'dashboard.view'
        ]);

        // User gets basic permissions
        $user->givePermissionTo([
            'profile.view', 'profile.edit', 'profile.change-password',
            'dashboard.view'
        ]);

        // Create default super admin user
        $superAdminUser = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
            'is_active' => true
        ]);

        $superAdminUser->assignRole('Super Admin');

        // Create default admin user
        $adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin.user@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
            'is_active' => true
        ]);

        $adminUser->assignRole('Admin');

        // Create default manager user
        $managerUser = User::create([
            'name' => 'Manager User',
            'email' => 'manager@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
            'is_active' => true
        ]);

        $managerUser->assignRole('Manager');

        // Create default regular user
        $regularUser = User::create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
            'is_active' => true
        ]);

        $regularUser->assignRole('User');
    }
}