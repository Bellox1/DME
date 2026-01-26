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
        $user = Auth::user();

        // Récupérer l'ID du patient (soit directement depuis utilisateur, soit depuis enfant)
        $patientId = null;
        $patient = \App\Models\Patient::where('utilisateur_id', $user->id)->first();
        if ($patient) {
            $patientId = $patient->id;
        } else {
            // Si l'utilisateur est un parent, chercher ses enfants
            $enfants = \App\Models\Enfant::where('parent_id', $user->id)->get();
            if ($enfants->isEmpty()) {
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
        }

        $query = Prescription::with(['consultation']);

        if ($patientId) {
            $query->whereHas('consultation', function($q) use ($patientId) {
                $q->where('patient_id', $patientId);
            });
        } else {
            // Pour les parents, chercher les ordonnances de tous les enfants
            $enfantIds = $enfants->pluck('id');
            $query->whereHas('consultation', function($q) use ($enfantIds) {
                $q->whereIn('patient_id', $enfantIds);
            });
        }

        $prescriptions = $query->get();

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
        $user = Auth::user();

        // Récupérer l'ID du patient (soit directement depuis utilisateur, soit depuis enfant)
        $patientId = null;
        $patient = \App\Models\Patient::where('utilisateur_id', $user->id)->first();
        if ($patient) {
            $patientId = $patient->id;
        }

        $query = Prescription::with(['consultation', 'medecin']);

        if ($patientId) {
            // Patient direct
            $query->whereHas('consultation', function($q) use ($patientId) {
                $q->where('patient_id', $patientId);
            });
        } else {
            // Parent : chercher les ordonnances de tous ses enfants
            $enfants = \App\Models\Enfant::where('parent_id', $user->id)->get();
            if ($enfants->isNotEmpty()) {
                $enfantIds = $enfants->pluck('id');
                $query->whereHas('consultation', function($q) use ($enfantIds) {
                    $q->whereIn('patient_id', $enfantIds);
                });
            } else {
                // Aucun enfant trouvé
                return response()->json([
                    'success' => true,
                    'data' => []
                ]);
            }
        }

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
    public function show($id)
    {
        $user = Auth::user();

        // Récupérer l'ID du patient (soit directement depuis utilisateur, soit depuis enfant)
        $patientId = null;
        $patient = \App\Models\Patient::where('utilisateur_id', $user->id)->first();
        if ($patient) {
            $patientId = $patient->id;
        }

        $query = Prescription::with(['consultation', 'medecin']);

        if ($patientId) {
            // Patient direct
            $query->whereHas('consultation', function($q) use ($patientId) {
                $q->where('patient_id', $patientId);
            });
        } else {
            // Parent : chercher les ordonnances de tous ses enfants
            $enfants = \App\Models\Enfant::where('parent_id', $user->id)->get();
            if ($enfants->isNotEmpty()) {
                $enfantIds = $enfants->pluck('id');
                $query->whereHas('consultation', function($q) use ($enfantIds) {
                    $q->whereIn('patient_id', $enfantIds);
                });
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucune ordonnance trouvée'
                ], 404);
            }
        }

        $prescription = $query->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $prescription
        ]);
    }

    /**
     * Lister les ordonnances par consultation.
     */
    public function getByConsultation($consultationId)
    {
        $patientId = Auth::id();

        // Vérifier que la consultation appartient au patient
        $consultation = Consultation::where('patient_id', $patientId)
            ->findOrFail($consultationId);

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
    public function downloadPdf($id)
    {
        $user = Auth::user();

        // Récupérer l'ID du patient (soit directement depuis utilisateur, soit depuis enfant)
        $patientId = null;
        $patient = \App\Models\Patient::where('utilisateur_id', $user->id)->first();
        if ($patient) {
            $patientId = $patient->id;
        }

        $query = Prescription::with(['consultation', 'medecin']);

        if ($patientId) {
            // Patient direct
            $query->whereHas('consultation', function($q) use ($patientId) {
                $q->where('patient_id', $patientId);
            });
        } else {
            // Parent : chercher les ordonnances de tous ses enfants
            $enfants = \App\Models\Enfant::where('parent_id', $user->id)->get();
            if ($enfants->isNotEmpty()) {
                $enfantIds = $enfants->pluck('id');
                $query->whereHas('consultation', function($q) use ($enfantIds) {
                    $q->whereIn('patient_id', $enfantIds);
                });
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucune ordonnance trouvée'
                ], 404);
            }
        }

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

    /**
     * Créer une nouvelle ordonnance (pour les médecins).
     */
    public function store(Request $request)
    {
        $request->validate([
            'consultation_id' => 'required|exists:consultations,id',
            'medicaments' => 'required|array',
            'medicaments.*.nom_medicament' => 'required|string|max:255',
            'medicaments.*.dosage' => 'required|string|max:100',
            'medicaments.*.instructions' => 'nullable|string',
        ]);

        $medecinId = Auth::id();
        $consultation = Consultation::findOrFail($request->consultation_id);

        // Vérifier que le médecin est autorisé pour cette consultation
        if ($consultation->medecin_id != $medecinId) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'êtes pas autorisé à créer une ordonnance pour cette consultation.'
            ], 403);
        }

        $prescriptions = [];
        $numeroOrdonnance = $this->generateNumeroOrdonnance();

        DB::transaction(function () use ($request, $medecinId, $numeroOrdonnance, &$prescriptions) {
            foreach ($request->medicaments as $medicament) {
                $prescription = Prescription::create([
                    'numero_ordonnance' => $numeroOrdonnance,
                    'consultation_id' => $request->consultation_id,
                    'medecin_id' => $medecinId,
                    'nom_medicament' => $medicament['nom_medicament'],
                    'dosage' => $medicament['dosage'],
                    'instructions' => $medicament['instructions'] ?? null,
                    'statut' => 'ACTIVE',
                ]);
                $prescriptions[] = $prescription;
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Ordonnance créée avec succès',
            'data' => [
                'numero_ordonnance' => $numeroOrdonnance,
                'prescriptions' => $prescriptions
            ]
        ], 201);
    }
}
