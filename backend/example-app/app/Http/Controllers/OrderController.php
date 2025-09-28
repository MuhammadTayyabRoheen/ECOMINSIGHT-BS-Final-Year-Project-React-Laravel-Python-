<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Interaction;
class OrderController extends Controller
{
    public function placeOrder(Request $request)
{
    $request->validate([
        'address' => 'required|string|max:255',
    ]);

    $user = Auth::user();
    $cartItems = Cart::with('product')->where('user_id', $user->id)->get();

    if ($cartItems->isEmpty()) {
        return response()->json(['error' => 'Cart is empty'], 400);
    }

    $total = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);

    $order = Order::create([
        'user_id' => $user->id,
        'address' => $request->address, // ✅ Save address
        'total' => $total,
        'status' => 'pending'
    ]);
    
    foreach ($cartItems as $item) {
        // ✅ Create order item
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $item->product_id,
            'quantity' => $item->quantity,
            'price' => $item->product->price,
        ]);

        // ✅ Log interaction after each product is ordered
        Interaction::create([
            'user_id' => $user->id,
            'product_id' => $item->product_id,
            'interaction_type' => 'order',
            'timestamp' => now()
        ]);
    }

    foreach ($cartItems as $item) {
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $item->product_id,
            'quantity' => $item->quantity,
            'price' => $item->product->price,
        ]);
    }

    Cart::where('user_id', $user->id)->delete();

    return response()->json(['message' => 'Order placed successfully', 'order_id' => $order->id]);
}


    public function viewAllOrders()
    {
        return Order::with('user')->latest()->paginate(10);
    }

    public function confirmOrder($id)
    {
        $order = Order::findOrFail($id);

        if ($order->status !== 'pending') {
            return response()->json(['error' => 'Order is already confirmed or processed'], 400);
        }

        $order->status = 'confirmed';
        $order->save();

        return response()->json(['message' => 'Order confirmed']);
    }
public function myOrders()
{
    $orders = Order::with('items.product')
        ->where('user_id', Auth::id())
        ->latest()
        ->paginate(10);

    return response()->json([
        'data' => $orders->items(),          // 👈 the paginated orders
        'meta' => [
            'current_page' => $orders->currentPage(),
            'last_page' => $orders->lastPage(),
            'per_page' => $orders->perPage(),
            'total' => $orders->total(),
        ],
    ]);
}


    public function orderDetails($id)
    {
        $order = Order::with('items.product', 'user')->findOrFail($id);

        if (Auth::user()->hasRole('user') && $order->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($order);
    }

    public function cancelOrder($id)
    {
        $order = Order::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        if ($order->status !== 'pending') {
            return response()->json(['error' => 'Only pending orders can be cancelled'], 400);
        }

        $order->status = 'cancelled';
        $order->save();

        return response()->json(['message' => 'Order cancelled']);
    }

    public function deleteOrder($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();

        return response()->json(['message' => 'Order deleted']);
    }

    public function changeStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,shipped,delivered,cancelled'
        ]);

        $order = Order::findOrFail($id);
        $order->status = $request->status;
        $order->save();

        return response()->json(['message' => 'Order status updated']);
    }

    public function reorder($orderId)
    {
        $order = Order::with('items')->where('user_id', Auth::id())->findOrFail($orderId);

        foreach ($order->items as $item) {
            Cart::updateOrCreate(
                ['user_id' => Auth::id(), 'product_id' => $item->product_id],
                ['quantity' => $item->quantity]
            );
        }

        return response()->json(['message' => 'Order added back to cart for reordering']);
    }


    public function trackOrder($id)
{
    $order = Order::where('user_id', Auth::id())->findOrFail($id);

    return response()->json([
        'order_id' => $order->id,
        'status' => $order->status,
        'updated_at' => $order->updated_at
    ]);
}

// In app/Http/Controllers/OrderController.php

public function userOrderStats(Request $request)
{
    $user = auth()->user();

    $total = $user->orders()->count();
    $shipped = $user->orders()->where('status', 'shipped')->count();
    $delivered = $user->orders()->where('status', 'delivered')->count();

    return response()->json([
        'total' => $total,
        'shipped' => $shipped,
        'delivered' => $delivered,
    ]);
}


}