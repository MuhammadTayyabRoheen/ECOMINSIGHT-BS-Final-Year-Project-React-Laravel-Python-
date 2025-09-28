<?php

namespace App\Services;

use App\Helpers\ResponseHelper;
use App\Http\DTO\AuthDTO;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    public function register(AuthDTO $dto)
    {
        // Create a new user
        $user = User::create([
            'name' => $dto->name,
            'email' => $dto->email,
            'password' => $dto->password,
        ]);
    
        // Automatically assign the 'user' role to the newly registered user
        $user->assignRole('user');
    
        // Generate JWT token for the user
        $token = Auth::login($user);
    
        // Return a successful response with user details and token
        return ResponseHelper::success([
            'token' => $token,
            'user' => [
                'id' => $user->id, // ✅ Add this line

                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->getRoleNames(), // Retrieve role names
            ]
        ], 'User registered successfully.');
    }

    public function login($credentials)
    {
        if (!$token = Auth::attempt($credentials)) {
            return ResponseHelper::error('Invalid credentials', 401);
        }

        $user = Auth::user();
        $role = $user->getRoleNames()->first();  // Retrieve user role

        return ResponseHelper::success([
            'token' => $token,
            'user' => [
                'id' => $user->id, // ✅ Add this line
                'name' => $user->name,
                'email' => $user->email,
                'role' => $role,
            ],
            'redirect_to' => $role === 'admin' ? '/admin' : '/user',  // Redirect based on role
        ], 'User logged in successfully.');
    }
}
