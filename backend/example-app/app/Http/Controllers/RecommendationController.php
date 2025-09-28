<?php

namespace App\Http\Controllers;

use App\Models\Recommendation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RecommendationController extends Controller
{
   public function get($user_id)
{    

   
    $data = Recommendation::where('user_id', $user_id)->get();

    if ($data->isEmpty()) {
        return response()->json(['message' => 'No recommendations found.']);
    }

    return Recommendation::where('user_id', $user_id)
        ->with('product') // this will be null if relationship is broken
        ->get();
}

public function import(Request $request)
{
    $validated = $request->validate([
        '*.user_id' => 'required|integer',
        '*.product_id' => 'required|integer',
        '*.score' => 'nullable|numeric'
    ]);

    $userId = $request[0]['user_id'];

    // 🔁 Delete old recommendations for user
    \App\Models\Recommendation::where('user_id', $userId)->delete();

    // Insert new ones
    \App\Models\Recommendation::insert($request->all());

    return response()->json(['message' => 'Recommendations updated']);
}

}
