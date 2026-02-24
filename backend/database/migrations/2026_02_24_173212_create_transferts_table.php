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
        Schema::create('transferts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
            $table->foreignId('medecin_expediteur_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->foreignId('medecin_destinataire_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->text('motif')->nullable();
            $table->enum('statut', ['en_attente', 'accepté', 'refusé'])->default('en_attente');
            $table->timestamp('date_transfert')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transferts');
    }
};
