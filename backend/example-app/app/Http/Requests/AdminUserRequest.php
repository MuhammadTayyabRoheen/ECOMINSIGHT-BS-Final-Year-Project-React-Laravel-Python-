<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminUserRequest extends FormRequest
{
    public function authorize()
    {
        // Only allow admin role to access this
        return auth()->user()->hasRole('admin');
    }

    public function rules()
    {
        return [
            // No specific rules for fetching all users
        ];
    }
}
