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
        Schema::create('tracabilites', function (Blueprint $table) {
            $table->id();
            $table->dateTime('dateH')->useCurrent();
            $table->foreignId('utilisateur_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->string('action', 255);
            $table->string('nom_table', 100);
            $table->string('champ', 100)->nullable();
            $table->text('ancienne_valeur')->nullable();
            $table->text('nouvelle_valeur')->nullable();
            $table->timestamp('date_creation')->useCurrent();
            $table->timestamp('date_modification')->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tracabilites');
    }
};
