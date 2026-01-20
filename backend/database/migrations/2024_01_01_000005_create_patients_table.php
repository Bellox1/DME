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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('utilisateur_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->string('nom', 50);
            $table->string('prenom', 50);
            $table->decimal('taille', 5, 2)->nullable();
            $table->decimal('poids', 5, 2)->nullable();
            $table->string('adresse', 255)->nullable();
            $table->date('date_naissance')->nullable();
            $table->enum('groupe_sanguin', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])->nullable();
            $table->foreignId('tuteur_id')->nullable()->constrained('utilisateurs')->onDelete('set null');
            $table->timestamp('date_creation')->useCurrent();
            $table->timestamp('date_modification')->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
