<?php

namespace App\Http\DTO;

class AuthDTO
{
    public $name;
    public $email;
    public $password;
   

    public function __construct($name, $email, $password, $role = 'user')
    {
        $this->name = $name;
        $this->email = $email;
        $this->password = bcrypt($password);
       
    }
}
