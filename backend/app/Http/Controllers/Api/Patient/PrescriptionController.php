<?php

namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use App\Models\Consultation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class PrescriptionController extends Controller
{
    /**
     * Générer un numéro d'ordonnance unique.
     */
    private function generateNumeroOrdonnance()
    {
        $year = date('Y');
        $prefix = 'ORD-' . $year . '-';

        $lastPrescription = Prescription::where('numero_ordonnance', 'like', $prefix . '%')
            ->orderBy('numero_ordonnance', 'desc')
            ->first();

        if ($lastPrescription) {
            $lastNumber = intval(str_replace($prefix, '', $lastPrescription->numero_ordonnance));
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Obtenir les statistiques des ordonnances du patient.
     */
    public function getStats(Request $request)
    {
        if (!$request->user()->hasPermission('voir_prescriptions')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $user = $request->user();

        // --- Récupération des dossiers accessibles ---
        $dossierPrincipal = \App\Models\Patient::where('utilisateur_id', $user->id)->first();
        $enfantsIds = \App\Models\Enfant::where('parent_id', $user->id)->pluck('id');
        $dossiersEnfants = \App\Models\Patient::whereIn('enfant_id', $enfantsIds)->get();

        $allPatientsIds = collect([]);
        if ($dossierPrincipal) $allPatientsIds->push($dossierPrincipal->id);
        foreach ($dossiersEnfants as $d) $allPatientsIds->push($d->id);

        // --- Filtrage par Patient Spécifique (Optionnel) ---
        $requestedPatientId = $request->query('patient_id');
        $patientsIds = collect([]);

        if ($requestedPatientId && $requestedPatientId !== 'all') {
            // Sécurité : Vérifier que l'utilisateur a le droit d'accéder à ce patient précis
            if ($allPatientsIds->contains($requestedPatientId)) {
                $patientsIds->push($requestedPatientId);
            } else {
                return response()->json(['message' => 'Accès non autorisé à ce profil.'], 403);
            }
        } elseif ($requestedPatientId === 'all') {
            // Vue Globale (Optionnelle)
            $patientsIds = $allPatientsIds;
        } else {
            // Vue Par Défaut : Titulaire uniquement
            if ($dossierPrincipal) {
                $patientsIds->push($dossierPrincipal->id);
            } else if ($allPatientsIds->isNotEmpty()) {
                $patientsIds->push($allPatientsIds->first());
            }
        }

        if ($patientsIds->isEmpty()) {
            return response()->json([
                'success' => true,
                'data' => [
                    'total' => 0,
                    'active' => 0,
                    'expired' => 0,
                    'cancelled' => 0
                ]
            ]);
        }

        $prescriptions = Prescription::whereHas('consultation', function($q) use ($patientsIds) {
            $q->whereIn('patient_id', $patientsIds);
        })->get();

        $stats = [
            'total' => $prescriptions->count(),
            'active' => $prescriptions->where('statut', 'ACTIVE')->count(),
            'expired' => $prescriptions->where('statut', 'EXPIREE')->count(),
            'cancelled' => $prescriptions->where('statut', 'ANNULEE')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Lister les ordonnances du patient.
     */
    public function index(Request $request)
    {
        if (!$request->user()->hasPermission('voir_prescriptions')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $user = $request->user();

        // --- Récupération des dossiers accessibles ---
        $dossierPrincipal = \App\Models\Patient::where('utilisateur_id', $user->id)->first();
        $enfantsIds = \App\Models\Enfant::where('parent_id', $user->id)->pluck('id');
        $dossiersEnfants = \App\Models\Patient::whereIn('enfant_id', $enfantsIds)->get();

        $allPatientsIds = collect([]);
        if ($dossierPrincipal) $allPatientsIds->push($dossierPrincipal->id);
        foreach ($dossiersEnfants as $d) $allPatientsIds->push($d->id);

        // --- Filtrage par Patient Spécifique (Optionnel) ---
        $requestedPatientId = $request->query('patient_id');
        $patientsIds = collect([]);

        if ($requestedPatientId && $requestedPatientId !== 'all') {
            // Sécurité : Vérifier que l'utilisateur a le droit d'accéder à ce patient précis
            if ($allPatientsIds->contains($requestedPatientId)) {
                $patientsIds->push($requestedPatientId);
            } else {
                return response()->json(['message' => 'Accès non autorisé à ce profil.'], 403);
            }
        } elseif ($requestedPatientId === 'all') {
            // Vue Globale (Optionnelle)
            $patientsIds = $allPatientsIds;
        } else {
            // Vue Par Défaut : Titulaire uniquement
            if ($dossierPrincipal) {
                $patientsIds->push($dossierPrincipal->id);
            } else if ($allPatientsIds->isNotEmpty()) {
                $patientsIds->push($allPatientsIds->first());
            }
        }

        if ($patientsIds->isEmpty()) {
            return response()->json([
                'success' => true,
                'data' => []
            ]);
        }

        $query = Prescription::with(['consultation', 'medecin'])
            ->whereHas('consultation', function($q) use ($patientsIds) {
                $q->whereIn('patient_id', $patientsIds);
            });

        // Filtrage par consultation si spécifié
        if ($request->has('consultation_id')) {
            $query->where('consultation_id', $request->consultation_id);
        }

        $prescriptions = $query->orderBy('date_creation', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $prescriptions
        ]);
    }

    /**
     * Afficher une ordonnance spécifique.
     */
    public function show($id, Request $request)
    {
        if (!$request->user()->hasPermission('voir_prescriptions')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $user = $request->user();

        // --- Récupération des dossiers accessibles ---
        $dossierPrincipal = \App\Models\Patient::where('utilisateur_id', $user->id)->first();
        $enfantsIds = \App\Models\Enfant::where('parent_id', $user->id)->pluck('id');
        $dossiersEnfants = \App\Models\Patient::whereIn('enfant_id', $enfantsIds)->get();

        $allPatientsIds = collect([]);
        if ($dossierPrincipal) $allPatientsIds->push($dossierPrincipal->id);
        foreach ($dossiersEnfants as $d) $allPatientsIds->push($d->id);

        $query = Prescription::with(['consultation', 'medecin'])
            ->whereHas('consultation', function($q) use ($allPatientsIds) {
                $q->whereIn('patient_id', $allPatientsIds);
            });

        $prescription = $query->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $prescription
        ]);
    }

    /**
     * Lister les ordonnances par consultation.
     */
    public function getByConsultation($consultationId, Request $request)
    {
        if (!$request->user()->hasPermission('voir_prescriptions')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $user = $request->user();

        // --- Récupération des dossiers accessibles ---
        $dossierPrincipal = \App\Models\Patient::where('utilisateur_id', $user->id)->first();
        $enfantsIds = \App\Models\Enfant::where('parent_id', $user->id)->pluck('id');
        $dossiersEnfants = \App\Models\Patient::whereIn('enfant_id', $enfantsIds)->get();

        $allPatientsIds = collect([]);
        if ($dossierPrincipal) $allPatientsIds->push($dossierPrincipal->id);
        foreach ($dossiersEnfants as $d) $allPatientsIds->push($d->id);

        // Trouver la consultation et vérifier l'accès
        $consultation = Consultation::with('patient')->findOrFail($consultationId);

        $isOwner = ($consultation->patient->utilisateur_id == $user->id);
        $isParent = \App\Models\Enfant::where('id', $consultation->patient->enfant_id)
            ->where('parent_id', $user->id)
            ->exists();

        if (!$isOwner && !$isParent) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $prescriptions = Prescription::with(['medecin'])
            ->where('consultation_id', $consultationId)
            ->orderBy('date_creation', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $prescriptions,
            'consultation' => $consultation
        ]);
    }

    /**
     * Télécharger une ordonnance en PDF.
     */
    public function downloadPdf($id, Request $request)
    {
        if (!$request->user()->hasPermission('voir_prescriptions')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $user = $request->user();

        // --- Récupération des dossiers accessibles ---
        $dossierPrincipal = \App\Models\Patient::where('utilisateur_id', $user->id)->first();
        $enfantsIds = \App\Models\Enfant::where('parent_id', $user->id)->pluck('id');
        $dossiersEnfants = \App\Models\Patient::whereIn('enfant_id', $enfantsIds)->get();

        $allPatientsIds = collect([]);
        if ($dossierPrincipal) $allPatientsIds->push($dossierPrincipal->id);
        foreach ($dossiersEnfants as $d) $allPatientsIds->push($d->id);

        $query = Prescription::with(['consultation', 'medecin'])
            ->whereHas('consultation', function($q) use ($allPatientsIds) {
                $q->whereIn('patient_id', $allPatientsIds);
            });

        $prescription = $query->findOrFail($id);

        // Générer un numéro si manquant
        if (!$prescription->numero_ordonnance) {
            $prescription->numero_ordonnance = $this->generateNumeroOrdonnance();
            $prescription->save();
        }

        // Si le fichier PDF existe déjà, le télécharger
        if ($prescription->fichier_pdf && Storage::disk('public')->exists($prescription->fichier_pdf)) {
            $filePath = storage_path('app/public/' . $prescription->fichier_pdf);
            return response()->download($filePath, 'ordonnance_' . $prescription->numero_ordonnance . '.pdf');
        }

        // Sinon, générer le PDF
        try {
            $pdf = $this->generatePdf($prescription);

            // Sauvegarder le PDF
            $filename = 'ordonnances/ordonnance_' . $prescription->numero_ordonnance . '.pdf';
            Storage::disk('public')->put($filename, $pdf->output());

            // Mettre à jour la prescription avec le nom du fichier
            $prescription->update(['fichier_pdf' => $filename]);

            $filePath = storage_path('app/public/' . $filename);
            return response()->download($filePath, 'ordonnance_' . $prescription->numero_ordonnance . '.pdf');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la génération du PDF: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Générer le PDF d'une ordonnance.
     */
    private function generatePdf($prescription)
    {
        $data = [
            'prescription' => $prescription,
            'patient' => $prescription->consultation->patient ?? null,
            'medecin' => $prescription->medecin ?? null,
            'consultation' => $prescription->consultation ?? null,
        ];

        $pdf = Pdf::loadView('pdf.ordonnance', $data);
        return $pdf;
    }
}
