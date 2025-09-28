<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'image'];

    protected $appends = ['image_url']; // 👈 auto include in API JSON

    public function subcategories()
    {
        return $this->hasMany(Subcategory::class);
    }

    // ✅ Accessor for full image URL
    public function getImageUrlAttribute()
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }
}
