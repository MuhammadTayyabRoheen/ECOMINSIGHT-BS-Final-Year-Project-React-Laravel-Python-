<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id', 
        'user_id', 
        'quantity'
    ];

    /**
     * Relationship with Product.
     * Each cart item belongs to a specific product (many-to-one).
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Relationship with User.
     * Each cart item belongs to a specific user (many-to-one).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
