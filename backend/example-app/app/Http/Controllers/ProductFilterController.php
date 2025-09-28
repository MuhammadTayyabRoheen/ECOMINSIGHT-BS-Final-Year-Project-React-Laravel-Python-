<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Subcategory;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductFilterController extends Controller
{
    // 🔹 Products by Subcategory
    public function getBySubcategory($id)
    {
        $products = Product::where('subcategory_id', $id)->with('subcategory')->paginate(10);

        return response()->json($products);
    }

    // 🔹 Products by Category (via subcategories)
    public function getByCategory($id)
    {
        $products = Product::whereHas('subcategory', function ($query) use ($id) {
            $query->where('category_id', $id);
        })->with('subcategory')->paginate(10);

        return response()->json($products);
    }

    public function searchProducts(Request $request)
    {
        $query = Product::with(['subcategory.category']);
    
        if ($request->filled('keyword')) {
            $keyword = strtolower($request->keyword);
    
            $query->where(function ($q) use ($keyword) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$keyword}%"])
                  ->orWhereRaw('LOWER(description) LIKE ?', ["%{$keyword}%"])
                  ->orWhereHas('subcategory', function ($sub) use ($keyword) {
                      $sub->whereRaw('LOWER(name) LIKE ?', ["%{$keyword}%"]);
                  })
                  ->orWhereHas('subcategory.category', function ($cat) use ($keyword) {
                      $cat->whereRaw('LOWER(name) LIKE ?', ["%{$keyword}%"]);
                  });
            });
        }
    
        // Optional: Filter by exact category ID
        if ($request->filled('category_id')) {
            $query->whereHas('subcategory.category', function ($q) use ($request) {
                $q->where('id', $request->category_id);
            });
        }
    
        // Optional: Filter by exact subcategory ID
        if ($request->filled('subcategory_id')) {
            $query->where('subcategory_id', $request->subcategory_id);
        }
    
        // Order by product name
        $query->orderBy('name', 'asc');
    
        $products = $query->paginate(10);
    
        if ($products->isEmpty()) {
            return response()->json([
                'data' => [],
                'message' => 'No products matched your search.'
            ], 200);
        }
    
        return response()->json($products);
    }
    
}
