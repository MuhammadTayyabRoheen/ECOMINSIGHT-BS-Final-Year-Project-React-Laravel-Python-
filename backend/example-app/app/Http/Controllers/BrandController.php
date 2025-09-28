<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BrandController extends Controller
{
    // ✅ GET all brands
    public function index(): JsonResponse
    {
        $brands = Brand::all();
        return response()->json([
            'brands' => $brands,
            'message' => 'Brands retrieved successfully'
        ], 200);
    }

    // ✅ POST add new brand
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|unique:brands,name',
        ]);

        $brand = Brand::create([
            'name' => $request->name,
        ]);

        return response()->json([
            'brand' => $brand,
            'message' => 'Brand added successfully'
        ], 201);
    }

    // ✅ DELETE a brand
    public function destroy($id): JsonResponse
    {
        $brand = Brand::findOrFail($id);
        $brand->delete();

        return response()->json([
            'message' => 'Brand deleted successfully'
        ], 200);
    }

    // In BrandController.php
public function update(Request $request, $id): JsonResponse
{
    $request->validate([
        'name' => 'required|string|unique:brands,name,' . $id,
    ]);

    $brand = Brand::findOrFail($id);
    $brand->name = $request->name;
    $brand->save();

    return response()->json([
        'brand' => $brand,
        'message' => 'Brand updated successfully'
    ], 200);
}

}
