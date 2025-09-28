<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run()
    {
        // Create roles
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'user']);

        // Create permissions (if needed)
        // Permission::create(['name' => 'edit articles']);
        // Permission::create(['name' => 'delete articles']);
    }
}
