<?php

namespace App\Http\Controllers;

use App\Services\StoreProductService;
use App\Helpers\ResponseHelper;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MainProductController extends Controller
{
    protected $storeProductService;

    public function __construct(StoreProductService $storeProductService)
    {
        $this->storeProductService = $storeProductService;
    }

    public function getAllProducts()
    {
        $stores = [
            'Johar Town' => 'http://127.0.0.1:8001/api/products', // Johar Town
            'DHA' => 'http://127.0.0.1:8002/api/products', // DHA
            'Lake City' => 'http://127.0.0.1:8003/api/products'  // Lake City
        ];

        $allProducts = [];

        foreach ($stores as $storeName => $storeUrl) {
            try {
                $response = Http::get($storeUrl);
                if ($response->successful()) {
                    $products = $response->json();
                    
                    // Add store location to each product
                    foreach ($products as &$product) {
                        $product['store_location'] = $storeName;
                    }
                    
                    // Merge products with existing list
                    $allProducts = array_merge($allProducts, $products);
                }
            } catch (\Exception $e) {
                // Log the error and continue with other stores
                Log::error("Failed to connect to $storeName: " . $e->getMessage());
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'All products fetched from stores successfully.',
            'data' => $allProducts
        ]);
    }
}
