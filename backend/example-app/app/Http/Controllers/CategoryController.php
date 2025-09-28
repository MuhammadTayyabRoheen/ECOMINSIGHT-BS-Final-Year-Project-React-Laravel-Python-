<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    // ✅ Store a new category with optional image
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:categories',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120'
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            // Store in storage/app/public/categories
            $imagePath = $request->file('image')->store('categories', 'public');
        }

        $category = Category::create([
            'name' => $request->name,
            'image' => $imagePath,
        ]);

        return response()->json([
            'message' => 'Category created successfully.',
            'category' => $category
        ]);
    }

    // ✅ Return all categories with subcategories and image_url via accessor
    public function index()
    {
        $categories = Category::with('subcategories')->get();
        return response()->json($categories);
    }

    public function update(Request $request, $id)
{
    $category = Category::findOrFail($id);

    $request->validate([
        'name' => 'required|string|unique:categories,name,' . $id,
        'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
    ]);

    // Handle image upload if a new image is provided
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('categories', 'public');
        $category->image = $imagePath;
    }

    $category->name = $request->name;
    $category->save();

    return response()->json([
        'message' => 'Category updated successfully.',
        'category' => $category
    ]);
}

    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully.']);
    }
}
