<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('discount_price', 10, 2)->nullable(); // ✅ Discount price
            $table->boolean('available')->default(true);
            $table->boolean('is_featured')->default(false); // ✅ Seasonal promo
            $table->integer('stock')->default(0); // ✅ Stock qty
            $table->unsignedBigInteger('brand_id')->nullable(); // ✅ FK to brands
            $table->string('store_location'); // Johar / DHA / etc.
            
            $table->timestamps();

        });
        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};
