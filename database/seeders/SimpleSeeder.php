<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class SimpleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create basic permissions
        $permissions = [
            'user.view',
            'user.create',
            'user.edit',
            'user.delete',
            'role.view',
            'role.create',
            'role.edit',
            'role.delete',
            'profile.view',
            'profile.edit',
            'content.view',
            'content.create',
            'content.edit',
            'content.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create basic roles
        $superAdmin = Role::create(['name' => 'Super Admin']);
        $superAdmin->givePermissionTo(Permission::all());

        $admin = Role::create(['name' => 'Admin']);
        $admin->givePermissionTo([
            'user.view', 'user.create', 'user.edit', 'user.delete',
            'role.view', 'role.create', 'role.edit', 'role.delete',
            'profile.view', 'profile.edit',
            'content.view', 'content.create', 'content.edit', 'content.delete',
        ]);

        $user = Role::create(['name' => 'User']);
        $user->givePermissionTo([
            'profile.view', 'profile.edit',
            'content.view',
        ]);

        $this->command->info('Basic roles and permissions created successfully!');
    }
}