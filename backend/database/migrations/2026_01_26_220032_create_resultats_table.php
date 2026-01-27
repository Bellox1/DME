<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resultats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
            $table->foreignId('medecin_id')->nullable()->constrained('utilisateurs')->onDelete('set null');
            $table->string('type'); // 'Labo' ou 'Imagerie'
            $table->string('titre'); // Ex: "Bilan Sanguin", "Radio Thorax"
            $table->text('description')->nullable();
            $table->string('fichier')->nullable(); // Chemin du fichier PDF/image
            $table->enum('statut', ['À valider', 'Normal', 'Anormal'])->default('À valider');
            $table->timestamp('date_examen')->useCurrent();
            $table->timestamp('date_creation')->useCurrent();
            $table->timestamp('date_modification')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resultats');
    }
};
