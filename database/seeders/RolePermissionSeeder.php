<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

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
            
            // System management
            'system.settings',
            'system.logs',
            'system.backup',
            
            // Content management
            'content.view',
            'content.create',
            'content.edit',
            'content.delete',
            'content.publish',
            
            // Report management
            'report.view',
            'report.create',
            'report.export',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $superAdmin = Role::create(['name' => 'Super Admin']);
        $superAdmin->givePermissionTo(Permission::all());

        $admin = Role::create(['name' => 'Admin']);
        $admin->givePermissionTo([
            'user.view', 'user.create', 'user.edit', 'user.activate', 'user.deactivate',
            'role.view', 'role.assign',
            'permission.view',
            'profile.view', 'profile.edit', 'profile.change-password',
            'system.settings', 'system.logs',
            'content.view', 'content.create', 'content.edit', 'content.delete', 'content.publish',
            'report.view', 'report.create', 'report.export',
        ]);

        $manager = Role::create(['name' => 'Manager']);
        $manager->givePermissionTo([
            'user.view',
            'profile.view', 'profile.edit', 'profile.change-password',
            'content.view', 'content.create', 'content.edit', 'content.publish',
            'report.view', 'report.create',
        ]);

        $user = Role::create(['name' => 'User']);
        $user->givePermissionTo([
            'profile.view', 'profile.edit', 'profile.change-password',
            'content.view',
        ]);

        $guest = Role::create(['name' => 'Guest']);
        $guest->givePermissionTo([
            'content.view',
        ]);
    }
}