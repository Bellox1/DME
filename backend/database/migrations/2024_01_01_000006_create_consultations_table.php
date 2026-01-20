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
        Schema::create('consultations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
            $table->foreignId('medecin_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->dateTime('dateH_visite');
            $table->string('motif', 255)->nullable();
            $table->text('antecedents')->nullable();
            $table->text('allergies')->nullable();
            $table->text('diagnostic')->nullable();
            $table->text('observations_medecin')->nullable();
            $table->text('traitement')->nullable();
            $table->string('duree_traitement', 50)->nullable();
            $table->decimal('prix', 10, 2)->nullable();
            $table->timestamp('date_creation')->useCurrent();
            $table->timestamp('date_modification')->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultations');
    }
};
