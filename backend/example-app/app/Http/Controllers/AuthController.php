<?php

namespace App\Http\Controllers;

use App\Http\DTO\AuthDTO;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Services\AuthService;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(RegisterRequest $request)
    {
        // Remove the role from the request, it's not needed anymore
        $dto = new AuthDTO($request->name, $request->email, $request->password);

        return $this->authService->register($dto);
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->only(['email', 'password']);
        return $this->authService->login($credentials);
    }

    public function userProfile()
    {
        return auth()->user();
    }

    public function adminProfile()
    {
        return auth()->user();
    }
    
}
