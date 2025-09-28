<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Storage;
use App\Models\Subcategory;
use Illuminate\Http\Request;

class SubcategoryController extends Controller
{
    //
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|max:5120',
        ]);
    
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('subcategory_images', 'public');
        }
    
        $subcategory = Subcategory::create([
            'name' => $request->name,
            'category_id' => $request->category_id,
            'image' => $imagePath,
        ]);
    
        return response()->json(['message' => 'Subcategory created', 'subcategory' => $subcategory]);
    }

    public function index()
    {
        $subcategories = Subcategory::with('category')->get();
    
        $subcategories->transform(function ($sub) {
            $sub->image_url = $sub->image ? asset('storage/' . $sub->image) : null;
            return $sub;
        });
    
        return response()->json($subcategories);
    }
    


public function update(Request $request, $id)
{
    $subcategory = Subcategory::findOrFail($id);

    $request->validate([
        'name' => 'sometimes|string',
        'category_id' => 'sometimes|exists:categories,id',
        'image' => 'nullable|image|max:2048',
    ]);

    if ($request->hasFile('image')) {
        if ($subcategory->image) {
            Storage::disk('public')->delete($subcategory->image);
        }
        $subcategory->image = $request->file('image')->store('subcategory_images', 'public');
    }

    $subcategory->update($request->only('name', 'category_id'));

    return response()->json(['message' => 'Subcategory updated', 'subcategory' => $subcategory]);
}

public function destroy($id)
{
    $subcategory = Subcategory::findOrFail($id);
    
    if ($subcategory->image) {
        Storage::disk('public')->delete($subcategory->image);
    }

    $subcategory->delete();

    return response()->json(['message' => 'Subcategory deleted']);
}


}
