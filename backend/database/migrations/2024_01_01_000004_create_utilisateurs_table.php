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
        Schema::create('utilisateurs', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 50);
            $table->string('prenom', 50);
            $table->string('tel', 20)->unique();
            $table->string('whatsapp', 20)->nullable()->unique();
            $table->string('mot_de_passe', 255);
            $table->enum('sexe', ['Homme', 'Femme']);
            $table->enum('role', ['admin', 'accueil', 'medecin', 'patient']);
            $table->boolean('est_tuteur')->default(false);
            $table->timestamp('date_creation')->useCurrent();
            $table->timestamp('date_modification')->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utilisateurs');
    }
};
