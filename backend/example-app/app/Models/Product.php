<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image',
        'price',
        'discount_price',
        'available',
        'is_featured',
        'stock',
        'brand_id',
        'store_location',
        'subcategory_id',
        'latitude',
        'longitude',
        'external_id'
    ];
    
    /**
     * Relationship with Cart items.
     * Each product can be in multiple cart items (one-to-many).
     */
    public function cartItems()
    {
        return $this->hasMany(Cart::class);
    }
    public function subcategory()
{
    return $this->belongsTo(Subcategory::class);
}
public function brand()
{
    return $this->belongsTo(Brand::class);
}
public function recommendations()
{
    return $this->hasMany(Recommendation::class);
}

}
