<?php

namespace App\Http\Controllers;
use App\Models\Interaction;
use Illuminate\Http\Request;

class InteractionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
            'product_id' => 'required|integer',
            'interaction_type' => 'required|in:view,order',
            'timestamp' => 'required|date' // 👈 Add this
        ]);

        Interaction::create($request->all());

        return response()->json(['message' => 'Interaction logged successfully']);
    }

    public function exportCSV()
{
    $interactions = \App\Models\Interaction::all(['user_id', 'product_id', 'interaction_type', 'timestamp']);

    $filename = 'interactions.csv';
    $handle = fopen($filename, 'w');
    fputcsv($handle, ['user_id', 'product_id', 'interaction_type', 'timestamp']);

    foreach ($interactions as $interaction) {
        fputcsv($handle, [
            $interaction->user_id,
            $interaction->product_id,
            $interaction->interaction_type,
            $interaction->timestamp
        ]);
    }

    fclose($handle);
    return response()->download($filename)->deleteFileAfterSend(true);
}

}
