<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class OrdonnanceController extends Controller
{
    /**
     * Générer et télécharger/afficher l'ordonnance en PDF.
     */
    public function generate($consultationId)
    {
        $consultation = Consultation::with(['patient', 'medecin', 'prescriptions'])->findOrFail($consultationId);

        // On peut créer une vue Blade pour le PDF
        // resources/views/pdf/ordonnance.blade.php
        
        $pdf = Pdf::loadView('pdf.ordonnance', compact('consultation'));
        
        // Options de papier, orientation
        $pdf->setPaper('a5', 'portrait');

        return $pdf->stream('ordonnance_' . $consultation->id . '.pdf');
        // Ou return $pdf->download('ordonnance.pdf');
    }
}
