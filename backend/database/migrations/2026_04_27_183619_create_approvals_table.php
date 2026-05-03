<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('approvals', function (Blueprint $table) {
            $table->id();
    
            $table->foreignId('requested_by')
                  ->constrained('users')
                  ->cascadeOnDelete();
    
            $table->foreignId('approved_by')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();
    
            $table->string('action');
            $table->text('data');
            $table->string('status')->default('pending');
    
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approvals');
    }
};
