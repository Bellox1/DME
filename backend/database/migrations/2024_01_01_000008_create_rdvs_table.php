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
        Schema::create('rdvs', function (Blueprint $table) {
            $table->id();
            $table->dateTime('dateH_rdv');
            $table->enum('statut', ['programmé', 'annulé', 'passé'])->default('programmé');
            $table->text('motif')->nullable();
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
            $table->foreignId('medecin_id')->nullable()->constrained('utilisateurs')->onDelete('cascade');
            $table->timestamp('date_creation')->useCurrent();
            $table->timestamp('date_modification')->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rdvs');
    }
};
