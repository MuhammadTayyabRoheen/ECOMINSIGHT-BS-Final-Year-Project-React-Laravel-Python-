<?php

namespace App\Http\Controllers;

use App\Http\Requests\AdminUserRequest;
use App\Services\UserService;
use App\Helpers\ResponseHelper;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function getAllUsers(AdminUserRequest $request)
{
    $users = User::latest()->paginate(10); // Paginate 10 users per page
    return response()->json([
        'data' => $users->items(), // The actual user list
        'meta' => [
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
            'per_page' => $users->perPage(),
            'total' => $users->total(),
        ]
    ]);
}


    public function deleteUser($id)
{
    $user = User::find($id);
    if (!$user) {
        return response()->json(['message' => 'User not found.'], 404);
    }
    $user->delete();
    return response()->json(['message' => 'User deleted successfully.']);
}

// In ProductController or DashboardController
public function dashboardStats()
{
    return response()->json([
        'products' => Product::count(),
        'users' => User::where('role', 'user')->count(),
        'orders' => Order::count(),
        'revenue' => Order::sum('total'),
    ]);
}
public function getTopSellingProducts()
{
    $topProducts = DB::table('order_items')
        ->join('products', 'order_items.product_id', '=', 'products.id')
        ->select('products.id', 'products.name', DB::raw('SUM(order_items.quantity) as total_sold'))
        ->groupBy('products.id', 'products.name')
        ->orderByDesc('total_sold')
        ->limit(5)
        ->get();

    return response()->json($topProducts);
}


}
