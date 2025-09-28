<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    // Fetch products from Johar Town and store in main database
   // ✏️ Update fetchAndStoreProducts()
// ✏️ Update fetchAndStoreProducts()
public function fetchAndStoreProducts()
{
    $storeUrl = 'http://127.0.0.1:8001/api/products'; // Johar Town
    $response = Http::get($storeUrl);

    if ($response->successful()) {
        $products = $response->json();

        foreach ($products as $productData) {
            // Check if this external product already exists
            $exists = Product::where('external_id', $productData['id'])
                            ->where('store_location', 'Johar Town')
                            ->exists();

            if ($exists) {
                continue; // Skip this product
            }

            $productData['image'] = 'http://127.0.0.1:8001/storage/' . $productData['image'];

            Product::create([
                'external_id' => $productData['id'],
                'store_location' => 'Johar Town',
                'name' => $productData['name'],
                'description' => $productData['description'] ?? '',
                'image' => $productData['image'],
                'price' => $productData['price'],
                'discount_price' => $productData['discount_price'] ?? null,
                'available' => $productData['available'],
                'is_featured' => $productData['is_featured'] ?? false,
                'stock' => $productData['stock'] ?? 0,
                'brand_id' => $productData['brand_id'] ?? null,
                'subcategory_id' => $productData['subcategory_id'] ?? null,
                'latitude' => $productData['latitude'] ?? null,
                'longitude' => $productData['longitude'] ?? null,
            ]);
        }

        return response()->json(['status' => 'success', 'message' => 'New products added from Johar Town']);
    }

    return response()->json(['status' => 'error', 'message' => 'Failed to fetch Johar products'], 500);
}



    
    // Get all products with location for frontend display
    public function getProducts(Request $request)
    {
        $perPage = $request->input('per_page', 10); // Default to 10 products per page
    $products = Product::with('brand')->paginate($perPage);
     // Fix image URL if it's a local upload (not already full URL)
    foreach ($products as $product) {
        if (!str_starts_with($product->image, 'http')) {
            $product->image = asset('storage/' . $product->image); // converts to full URL
        }
    }
        return response()->json($products);
    }
    public function getProductById($id)
    {
        try {
            $product = Product::with(['brand', 'subcategory'])->findOrFail($id);
            return response()->json($product);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Product not found'], 404);
        }
    }
    
    public function getProductsByBrand($brand_id)
{
    $products = Product::with('brand') // Optional: eager load brand
        ->where('brand_id', $brand_id)
        ->paginate(6); // ✅ Add pagination (6 per page)

    return response()->json($products);
}


// Get products with discount
public function getDiscountedProducts(Request $request)
{
    Log::info('🔍 getDiscountedProducts hit!');

    $perPage = $request->input('per_page', 10);
    $products = Product::whereNotNull('discount_price')->paginate($perPage);

    if ($products->isEmpty()) {
        return response()->json(['error' => 'No discounted products found'], 404);
    }

    return response()->json($products);
}


// Get products on seasonal sale
public function getFeaturedProducts(Request $request)
{
    $perPage = $request->input('per_page', 10);
    $products = Product::where('is_featured', true)->paginate($perPage);

    if ($products->isEmpty()) {
        return response()->json(['error' => 'No featured products found'], 404);
    }

    return response()->json($products);
}

public function update(Request $request, $id)
{
    $product = Product::findOrFail($id);

    $request->validate([
        'name' => 'required|string',
        'description' => 'nullable|string',
        'price' => 'required|numeric',
        'discount_price' => 'nullable|numeric',
        'available' => 'required|boolean',
        'is_featured' => 'required|boolean',
        'stock' => 'required|integer',
        'brand_id' => 'nullable|exists:brands,id',
        'subcategory_id' => 'nullable|exists:subcategories,id',
        'image' => 'nullable|image|max:2048',
        'latitude' => 'nullable|numeric',
        'longitude' => 'nullable|numeric',
    ]);

    if ($request->hasFile('image')) {
        $product->image = $request->file('image')->store('product_images', 'public');
    }

    $product->update([
        'name' => $request->name,
        'description' => $request->description,
        'price' => $request->price,
        'discount_price' => $request->discount_price,
        'available' => $request->available,
        'is_featured' => $request->is_featured,
        'stock' => $request->stock,
        'brand_id' => $request->brand_id,
        'subcategory_id' => $request->subcategory_id,
        'latitude' => $request->latitude,
        'longitude' => $request->longitude,
        'image' => $product->image,
    ]);

    return response()->json(['message' => 'Product updated', 'product' => $product]);
}

public function destroy($id)
{
    $product = Product::findOrFail($id);
    $product->delete();

    return response()->json(['message' => 'Product deleted']);
}


// ✏️ Update fetchFromDHAStore()
public function fetchFromDHAStore()
{
    $storeUrl = 'http://127.0.0.1:8002/api/products'; // DHA
    $response = Http::get($storeUrl);

    if ($response->successful()) {
        $products = $response->json();

        foreach ($products as $productData) {
            $exists = Product::where('external_id', $productData['id'])
                            ->where('store_location', 'DHA')
                            ->exists();

            if ($exists) {
                continue;
            }

            $productData['image'] = 'http://127.0.0.1:8002/storage/' . $productData['image'];

            Product::create([
                'external_id' => $productData['id'],
                'store_location' => 'DHA',
                'name' => $productData['name'],
                'description' => $productData['description'] ?? '',
                'image' => $productData['image'],
                'price' => $productData['price'],
                'discount_price' => $productData['discount_price'] ?? null,
                'available' => $productData['available'],
                'is_featured' => $productData['is_featured'] ?? false,
                'stock' => $productData['stock'] ?? 0,
                'brand_id' => $productData['brand_id'] ?? null,
                'subcategory_id' => $productData['subcategory_id'] ?? null,
                'latitude' => $productData['latitude'] ?? null,
                'longitude' => $productData['longitude'] ?? null,
            ]);
        }

        return response()->json(['status' => 'success', 'message' => 'New products added from DHA']);
    }

    return response()->json(['status' => 'error', 'message' => 'Failed to fetch DHA products'], 500);
}
    
}
