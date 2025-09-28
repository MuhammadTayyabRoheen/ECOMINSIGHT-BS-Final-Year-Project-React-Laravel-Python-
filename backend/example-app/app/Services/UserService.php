<?php

namespace App\Services;

use App\Models\User;
use App\Http\DTO\UserDTO;
use Illuminate\Support\Collection;

class UserService
{
    public function getAllUsers(): Collection
    {
        // Get all users with their roles
        return User::with('roles')->get()->map(function ($user) {
            return UserDTO::fromModel($user);
        });
    }
}
