<?php
namespace App\Http\Controllers\Api\Accueil;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use App\Models\Enfant;
use App\Models\Patient;
use App\Models\Tracabilite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class PatientController extends Controller
{
    /**
     * Liste des patients (pour l'accueil/médecins)
     */
    public function index(Request $request)
    {
        $query = Patient::with(['utilisateur', 'enfant']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('utilisateur', function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                    ->orWhere('prenom', 'like', "%{$search}%");
            })->orWhereHas('enfant', function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                    ->orWhere('prenom', 'like', "%{$search}%");
            })->orWhere('numero_patient', 'like', "%{$search}%");
        }

        return response()->json($query->paginate(20));
    }
    public function enregistrer(Request $request)
    {
        $request->validate([
            'type' => 'required|in:soi_meme,enfant',
            'nom' => 'required|string|max:50',
            'prenom' => 'required|string|max:50',
            'sexe' => 'required|in:Homme,Femme',
            'date_naissance' => 'nullable|date',
            'groupe_sanguin' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
        ]);

        return DB::transaction(function () use ($request) {
            // On récupère l'utilisateur qui fait l'action (Agent d'accueil ou Parent)
            $userConnecte = $request->user();
            $typeCreation = "";

            if ($request->type === 'soi_meme') {
                // CAS 1 & 3 : L'adulte crée son propre dossier médical
                $patient = Patient::create([
                    'utilisateur_id' => $userConnecte->id,
                    'enfant_id' => null,
                    'adresse' => $request->adresse,
                    'groupe_sanguin' => $request->groupe_sanguin,
                    'taille' => $request->taille,
                    'poids' => $request->poids,
                ]);
                $typeCreation = "Profil Adulte Autonome";
            } else {
                // CAS 2 : L'adulte crée un dossier pour son enfant
                $enfant = Enfant::create([
                    'parent_id' => $userConnecte->id,
                    'nom' => $request->nom,
                    'prenom' => $request->prenom,
                    'sexe' => $request->sexe,
                    'date_naissance' => $request->date_naissance
                ]);

                $patient = Patient::create([
                    'utilisateur_id' => null,
                    'enfant_id' => $enfant->id,
                    'adresse' => $request->adresse,
                    'groupe_sanguin' => $request->groupe_sanguin,
                    'taille' => $request->taille,
                    'poids' => $request->poids,
                ]);
                $typeCreation = "Profil Enfant (Dépendant)";
            }

            // TRACABILITÉ : On inclut le numéro de patient pour l'audit
            // TRACABILITÉ : On inclut le numéro de patient pour l'audit
            \App\Services\TraceService::record(
                'création',
                'patients',
                "Création de dossier ($typeCreation) - Numéro: {$patient->numero_patient}",
                null,
                'success'
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Dossier médical créé avec succès',
                'data' => [
                    'patient_id' => $patient->id,
                    'numero_patient' => $patient->numero_patient, // Très important pour l'accueil !
                    'nom_complet' => $patient->nom_complet // Utilise l'accessor de ton modèle
                ]
            ], 201);
        });
    }

    public function getMesDossiers()
    {
        $user = Auth::user();

        // 1. Récupérer le dossier de l'adulte lui-même
        $dossierPersonnel = Patient::where('utilisateur_id', $user->id)->first();

        // 2. Récupérer les dossiers de ses enfants rattachés
        // On utilise la relation 'enfant' pour charger les détails (nom, prénom)
        $dossiersEnfants = Patient::whereHas('enfant', function ($query) use ($user) {
            $query->where('parent_id', $user->id);
        })->with('enfant')->get();

        return response()->json([
            'status' => 'success',
            'personnel' => $dossierPersonnel ? [
                'patient_id' => $dossierPersonnel->id,
                'numero' => $dossierPersonnel->numero_patient,
                'nom_complet' => $user->nom . ' ' . $user->prenom,
                'type' => 'Adulte'
            ] : null,
            'dependants' => $dossiersEnfants->map(function ($p) {
                return [
                    'patient_id' => $p->id,
                    'numero' => $p->numero_patient,
                    'nom_complet' => $p->enfant->nom . ' ' . $p->enfant->prenom,
                    'type' => 'Enfant'
                ];
            })
        ]);
    }

    /**
     * Création d'un NOUVEAU patient par l'accueil (Création de compte + Dossier)
     */
    public function store(Request $request)
    {
        // On formate les numéros avant la validation pour vérifier l'unicité réelle
        if ($request->has('tel')) {
            $request->merge(['tel' => \App\Helpers\PhoneHelper::formatBeninTel($request->tel)]);
        }
        if ($request->has('whatsapp')) {
            $request->merge(['whatsapp' => \App\Helpers\PhoneHelper::formatBeninWhatsApp($request->whatsapp)]);
        }

        \Illuminate\Support\Facades\Log::info("Requête création patient reçue", $request->all());
        // 1. Permission Check
        if (!$request->user()->hasPermission('creer_patients')) {
            return response()->json(['message' => 'Action non autorisée.'], 403);
        }

        // 2. Validation
        $request->validate([
            'nom' => 'required|string|max:50',
            'prenom' => 'required|string|max:50',
            'tel' => 'nullable|string|unique:utilisateurs,tel',
            'whatsapp' => 'nullable|string|unique:utilisateurs,whatsapp',
            'sexe' => 'required|in:Homme,Femme',
            'date_naissance' => 'nullable|date',
            'ville' => 'nullable|string',
            // Patient specific info
            'adresse' => 'nullable|string',
            'groupe_sanguin' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'taille' => 'nullable|numeric',
            'poids' => 'nullable|numeric',
        ], [
            'tel.unique' => 'Ce numéro de téléphone est déjà utilisé.',
            'whatsapp.unique' => 'Ce numéro WhatsApp est déjà utilisé.',
            'nom.required' => 'Le nom est obligatoire.',
            'prenom.required' => 'Le prénom est obligatoire.',
            'sexe.required' => 'Le sexe est obligatoire.',
        ]);

        if (empty($request->tel) && empty($request->whatsapp)) {
            return response()->json(['message' => 'Un numéro de téléphone ou WhatsApp est requis pour le compte patient.'], 422);
        }

        try {
            return DB::transaction(function () use ($request) {
                // A. Création Utilisateur (Rôle Patient)
                $user = Utilisateur::create([
                    'nom' => $request->nom,
                    'prenom' => $request->prenom,
                    'tel' => $request->tel,
                    'whatsapp' => $request->whatsapp,
                    'mot_de_passe' => \Illuminate\Support\Facades\Hash::make('password'),
                    'role' => 'patient',
                    'sexe' => $request->sexe,
                    'date_naissance' => $request->date_naissance,
                    'ville' => $request->ville,
                    'date_creation' => now(),
                    'date_modification' => now()
                ]);

                // B. Create Patient Record
                $patient = Patient::create([
                    'utilisateur_id' => $user->id,
                    'adresse' => $request->adresse,
                    'groupe_sanguin' => $request->groupe_sanguin,
                    'taille' => $request->taille,
                    'poids' => $request->poids,
                ]);

                // C. Create Connexion (First Login)
                \App\Models\Connexion::create([
                    'utilisateur_id' => $user->id,
                    'premiere_connexion' => true
                ]);

                // D. Send Notification
                $this->sendActivationNotification($user);

                // E. Traceability
                \App\Services\TraceService::record(
                    'création',
                    'patients',
                    "Création Patient + Compte User ID: {$user->id}",
                    null,
                    'success'
                );

                return response()->json([
                    'message' => 'Patient et compte utilisateur créés avec succès. Notification envoyée.',
                    'patient' => $patient,
                    'user' => $user
                ], 201);
            });

        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur création patient: ' . $e->getMessage()], 500);
        }
    }

    private function sendActivationNotification($user)
    {
        $identifier = $user->whatsapp ?? $user->tel;
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $activationLink = rtrim($frontendUrl, '/') . "/first-login?connexion=" . $identifier;
        $message = "Bienvenue sur DME (Patient). Votre dossier est ouvert. Activez votre compte pour y accéder : $activationLink";

        $twilio = new \App\Services\TwilioService();

        if ($user->whatsapp) {
            $twilio->sendWhatsApp($user->whatsapp, $message);
        }

        if ($user->tel) {
            $twilio->sendSMS($user->tel, $message);
        }
    }

}