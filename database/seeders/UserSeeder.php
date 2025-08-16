<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Super Admin
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('password123'),
            'phone' => '+1234567890',
            'address' => '123 Admin Street, Admin City',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $superAdmin->assignRole('Super Admin');

        // Create Admin
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'phone' => '+1234567891',
            'address' => '456 Admin Avenue, Admin City',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('Admin');

        // Create Manager
        $manager = User::create([
            'name' => 'Manager User',
            'email' => 'manager@example.com',
            'password' => Hash::make('password123'),
            'phone' => '+1234567892',
            'address' => '789 Manager Road, Manager City',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $manager->assignRole('Manager');

        // Create Regular User
        $user = User::create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => Hash::make('password123'),
            'phone' => '+1234567893',
            'address' => '321 User Lane, User City',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $user->assignRole('User');

        // Create Guest User
        $guest = User::create([
            'name' => 'Guest User',
            'email' => 'guest@example.com',
            'password' => Hash::make('password123'),
            'phone' => '+1234567894',
            'address' => '654 Guest Way, Guest City',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $guest->assignRole('Guest');
    }
}