<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class AdminSeeder extends Seeder
{
    public function run()
    {
        // Create the admin role if it doesn't exist
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        // Create the admin user if it doesn't exist
        $admin = User::firstOrCreate([
            'email' => 'admin@example.com',  // Change this to the actual email you want
        ], [
            'name' => 'Admin User',  // Default name for admin
            'password' => bcrypt('password123'),  // Change this to a secure password
            'role' => 'admin' // Add this line if you're keeping the column

        ]);

        // Assign the admin role to the created user
        $admin->assignRole($adminRole);
    }
}
