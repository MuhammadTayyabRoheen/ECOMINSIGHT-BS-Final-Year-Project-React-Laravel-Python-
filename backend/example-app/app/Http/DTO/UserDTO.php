<?php

namespace App\Http\DTO;

class UserDTO
{
    public $id;
    public $name;
    public $email;
    public $role;

    public function __construct($id, $name, $email, $role)
    {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
        $this->role = $role;
    }

    public static function fromModel($user)
    {
        return new self(
            $user->id,
            $user->name,
            $user->email,
            $user->getRoleNames()->first()
        );
    }
}
