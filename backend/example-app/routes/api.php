<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\MainProductController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductFilterController;
use App\Http\Controllers\SubcategoryController;
use App\Http\Controllers\InteractionController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\RecommendationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('chatbot/message', [ChatbotController::class, 'chat']);
Route::get('/chatbot/test', [ChatbotController::class, 'testConnection']);
Route::post('/interaction', [InteractionController::class, 'store']);
Route::get('/interactions/export', [InteractionController::class, 'exportCSV']);
// Public routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('products', [ProductController::class, 'getProducts']);
Route::get('products/search', [ProductFilterController::class, 'searchProducts']);
Route::get('products/discounted', [ProductController::class, 'getDiscountedProducts']);
Route::get('products/featured', [ProductController::class, 'getFeaturedProducts']);
Route::get('products/{id}', [ProductController::class, 'getProductById']);
Route::get('main-products', [MainProductController::class, 'getAllProducts']);
Route::get('categories', [CategoryController::class, 'index']);
Route::get('subcategories', [SubcategoryController::class, 'index']);
Route::post('payment/pay', [PaymentController::class, 'store']);


Route::get('products/category/{id}', [ProductFilterController::class, 'getByCategory']);
Route::get('products/subcategory/{id}', [ProductFilterController::class, 'getBySubcategory']);
// Admin-protected routes
Route::group(['middleware' => ['jwt.verify', 'role:admin']], function() {
    Route::get('admin/profile', [AuthController::class, 'adminProfile']);
    Route::get('admin/users', [AdminController::class, 'getAllUsers']);
    Route::delete('admin/user/{id}', [AdminController::class, 'deleteUser']);
   // ✅ ADD THESE:
    Route::get('admin/categories', [CategoryController::class, 'index']);
    Route::get('admin/subcategories', [SubcategoryController::class, 'index']);
    // Add other admin-specific routes here
      // Category/Subcategory Admin Creation
      Route::post('admin/category', [CategoryController::class, 'store']);
          Route::delete('admin/category/{id}', [CategoryController::class, 'destroy']);

      Route::post('admin/subcategory', [SubcategoryController::class, 'store']);
      Route::post('admin/subcategory/{id}/update', [SubcategoryController::class, 'update']); // POST instead of PUT for easier Postman testing
Route::delete('admin/subcategory/{id}', [SubcategoryController::class, 'destroy']);
      Route::get('admin/orders', [OrderController::class, 'viewAllOrders']);
Route::put('admin/order/confirm/{id}', [OrderController::class, 'confirmOrder']);
Route::put('admin/order/status/{id}', [OrderController::class, 'changeStatus']);
Route::delete('admin/order/delete/{id}', [OrderController::class, 'deleteOrder']);
Route::post('admin/product/{id}', [ProductController::class, 'update']);
Route::delete('admin/product/{id}', [ProductController::class, 'destroy']);
Route::post('admin/category/{id}/update', [CategoryController::class, 'update']);
Route::get('admin/order/detail/{id}', [OrderController::class, 'orderDetails']);
Route::get('admin/dashboard-stats', [AdminController::class, 'dashboardStats']);
Route::get('admin/top-products', [AdminController::class, 'getTopSellingProducts']);
    Route::get('admin/payments', [PaymentController::class, 'index']);


});

// User-protected routes
Route::group(['middleware' => ['jwt.verify', 'role:user']], function() {
    Route::get('user/profile', [AuthController::class, 'userProfile']);
    Route::post('cart/add', [CartController::class, 'addToCart']); // Add item to cart
    Route::get('cart', [CartController::class, 'getCart']); // Retrieve cart items
    // Add other user-specific routes here
    Route::get('order/stats', [OrderController::class, 'userOrderStats']);

    
// 🆕 New Routes
Route::delete('cart/remove/{product_id}', [CartController::class, 'removeFromCart']);
Route::delete('cart/clear', [CartController::class, 'clearCart']);
Route::put('cart/update/{product_id}', [CartController::class, 'updateQuantity']);

Route::post('order/place', [OrderController::class, 'placeOrder']);
Route::get('order/my', [OrderController::class, 'myOrders']);
Route::get('order/detail/{id}', [OrderController::class, 'orderDetails']);
Route::put('order/cancel/{id}', [OrderController::class, 'cancelOrder']);
Route::post('order/reorder/{id}', [OrderController::class, 'reorder']);
Route::get('order/status/{id}', [OrderController::class, 'trackOrder']);

});
  
// Product routes
Route::get('fetch-products', [ProductController::class, 'fetchAndStoreProducts']); // Fetch from external store and save in main
Route::get('fetch-dha-products', [ProductController::class, 'fetchFromDHAStore']);

Route::get('products', [ProductController::class, 'getProducts']); // Get products stored in main with location info



// Fetch all products from multiple stores (Main Website specific route)
Route::get('main-products', [MainProductController::class, 'getAllProducts']); // Fetch products directly from external sources

Route::get('/brands', [BrandController::class, 'index']);
Route::post('/brands', [BrandController::class, 'store']);
Route::delete('/brands/{id}', [BrandController::class, 'destroy']);
Route::put('/brands/{id}', [BrandController::class, 'update']);

Route::get('brands/{brand_id}/products', [ProductController::class, 'getProductsByBrand']);
Route::get('/recommendations/{user_id}', [RecommendationController::class, 'get']);
Route::post('/recommendations/import', [RecommendationController::class, 'import']);
