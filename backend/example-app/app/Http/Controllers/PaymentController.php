<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    // User calls this to make a payment:
    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'method' => 'required|string',
        ]);

        $order = Order::findOrFail($request->order_id);

        // Create payment record
        $payment = Payment::create([
            'order_id' => $order->id,
            'method' => $request->method,
           'amount' => $order->total ?? 4999,
            'status' => 'completed'
        ]);

        // Update order status
        $order->status = 'paid';
        $order->save();

        return response()->json([
            'message' => 'Payment recorded successfully',
            'payment' => $payment,
        ]);
    }

    // Admin sees all payments
    public function index()
{
    $payments = Payment::with(['order.user'])->get();

    $data = $payments->map(function($payment) {
        return [
            'id' => $payment->id,
            'order_id' => $payment->order_id,
            'customer_name' => $payment->order ? $payment->order->user->name : 'N/A',
            'amount' => $payment->amount,
            'method' => $payment->method,
            'status' => $payment->status,
        ];
    });

    return response()->json([
        'payments' => $data,
        'message' => 'Payments retrieved successfully'
    ], 200);
}
}
