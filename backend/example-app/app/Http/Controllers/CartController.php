<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function addToCart(Request $request)
    {
        $product = Product::findOrFail($request->product_id);

        $cart = Cart::updateOrCreate(
            ['user_id' => Auth::id(), 'product_id' => $product->id],
            ['quantity' => $request->input('quantity', 1)]
        );

        return response()->json(['status' => 'success', 'message' => 'Product added to cart.', 'cart' => $cart]);
    }

    public function getCart()
    {
        $cartItems = Cart::where('user_id', Auth::id())
            ->with('product')
            ->get();
    
        $total = 0;
        $items = $cartItems->map(function ($item) use (&$total) {
            $priceToUse = $item->product->discount_price ?? $item->product->price;
            $subtotal = $item->quantity * $priceToUse;
            $total += $subtotal;
    
            return [
                'id' => $item->id,
                'product_id' => $item->product->id,
                'name' => $item->product->name,
                'image' => $item->product->image,
                'price' => $priceToUse,
                'quantity' => $item->quantity,
                'subtotal' => $subtotal
            ];
        });
    
        return response()->json([
            'items' => $items,
            'total' => $total
        ]);
    }
    

    public function removeFromCart($productId)
    {
        Cart::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->delete();

        return response()->json(['status' => 'success', 'message' => 'Item removed from cart']);
    }

    public function clearCart()
    {
        Cart::where('user_id', Auth::id())->delete();

        return response()->json(['status' => 'success', 'message' => 'Cart cleared']);
    }

    public function updateQuantity(Request $request, $productId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cartItem = Cart::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->first();

        if (!$cartItem) {
            return response()->json(['status' => 'error', 'message' => 'Item not found in cart'], 404);
        }

        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        return response()->json(['status' => 'success', 'message' => 'Cart updated successfully']);
    }
}
