<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class StoreProductService
{
    protected $stores = [
        'joharTown' => 'http://johar-town-store-url/api/products',
        'dha' => 'http://dha-store-url/api/products',
        'lakeCity' => 'http://lake-city-store-url/api/products',
    ];

    public function getAllProducts()
    {
        $allProducts = [];

        foreach ($this->stores as $storeName => $url) {
            try {
                $response = Http::get($url);
                if ($response->successful()) {
                    $products = $response->json();
                    foreach ($products as $product) {
                        $product['store'] = $storeName;  // Add store identifier to each product
                        $allProducts[] = $product;
                    }
                }
            } catch (\Exception $e) {
                // Handle exception (e.g., log error, continue with other stores)
            }
        }

        return $allProducts;
    }
}
