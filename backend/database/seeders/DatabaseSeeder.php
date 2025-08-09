<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'Administrator']);
        $userRole = Role::firstOrCreate(['name' => 'User']);

        $admin = User::firstOrCreate(['email' => 'admin@example.com'], [
            'uuid' => (string) Str::uuid(),
            'name' => 'Admin',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $admin->assignRole($adminRole);
    }
}
