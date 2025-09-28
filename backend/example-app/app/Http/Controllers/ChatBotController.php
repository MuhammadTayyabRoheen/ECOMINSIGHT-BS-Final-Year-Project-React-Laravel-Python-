<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatbotController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:500',
        ]);

        $apiKey = env('OPENROUTER_API_KEY');
        $model = 'openai/gpt-3.5-turbo';

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer $apiKey",
                'Content-Type' => 'application/json',
            ])->post('https://openrouter.ai/api/v1/chat/completions', [
                'model' => $model,
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a helpful assistant for an e-commerce store.'],
                    ['role' => 'user', 'content' => $request->message],
                ],
            ]);

            // ✅ Show full error if OpenRouter response is unsuccessful
            if ($response->failed()) {
                return response()->json([
                    'error' => 'AI model responded with an error.',
                    'details' => $response->json(), // ⬅ return full details from OpenRouter
                ], $response->status());
            }

            $data = $response->json();
            $reply = $data['choices'][0]['message']['content'] ?? 'Sorry, I could not generate a response.';

            return response()->json(['reply' => $reply]);

        } catch (\Exception $e) {
            // ⛔ Fallback for exceptions like connection timeout or malformed request
            return response()->json([
                'error' => 'Something went wrong while connecting to OpenRouter.',
                'exception' => $e->getMessage(),
            ], 500);
        }
    }
}
