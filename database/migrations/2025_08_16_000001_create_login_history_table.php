<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('login_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('ip_address');
            $table->string('user_agent')->nullable();
            $table->string('device_type')->nullable();
            $table->string('browser')->nullable();
            $table->string('platform')->nullable();
            $table->string('location')->nullable();
            $table->enum('status', ['success', 'failed', 'blocked'])->default('success');
            $table->text('failure_reason')->nullable();
            $table->timestamp('login_at');
            $table->timestamp('logout_at')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index(['user_id', 'status']);
            $table->index('login_at');
            $table->index('ip_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('login_history');
    }
};