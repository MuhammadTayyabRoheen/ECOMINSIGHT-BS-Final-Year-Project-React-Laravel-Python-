<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function getUserProfile()
    {
        $user = Auth::user();
        return ResponseHelper::success($user, 'User profile fetched successfully.');
    }




    
}
