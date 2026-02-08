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
use Illuminate\Validation\Rule;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $query = Patient::with(['utilisateur', 'enfant']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->whereHas('utilisateur', function($sq) use ($search) {
                    $sq->where(DB::raw("CONCAT(nom, ' ', prenom)"), 'like', "%{$search}%")
                      ->orWhere(DB::raw("CONCAT(prenom, ' ', nom)"), 'like', "%{$search}%");
                })->orWhereHas('enfant', function($sq) use ($search) {
                    $sq->where(DB::raw("CONCAT(nom, ' ', prenom)"), 'like', "%{$search}%")
                      ->orWhere(DB::raw("CONCAT(prenom, ' ', nom)"), 'like', "%{$search}%");
                })->orWhere('numero_patient', 'like', "%{$search}%");
            });
        }

        // Filtres Cliniques Optionnels
        if ($request->filled('sexe')) {
            $sexeInput = $request->sexe;
            
            // Mapping frontend (M/F) -> Backend (Homme/Femme)
            $sexe = $sexeInput;
            if ($sexeInput === 'M') $sexe = 'Homme';
            if ($sexeInput === 'F') $sexe = 'Femme';

            $query->where(function($q) use ($sexe) {
                $q->whereHas('utilisateur', fn($sq) => $sq->where('sexe', $sexe))
                  ->orWhereHas('enfant', fn($sq) => $sq->where('sexe', $sexe));
            });
        }

        if ($request->filled('type')) {
            if ($request->type === 'adulte') $query->whereNotNull('utilisateur_id');
            if ($request->type === 'enfant') $query->whereNotNull('enfant_id');
        }

        if ($request->filled('groupe_sanguin')) {
            $query->where('groupe_sanguin', $request->groupe_sanguin);
        }

        // Filtre de sécurité STRICT pour les médecins
        if (auth()->check() && auth()->user()->role === 'medecin') {
            $query->whereHas('consultations', function($q) {
                $q->where('medecin_id', auth()->id());
            });
        }
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
            'parent_id' => 'nullable|exists:utilisateurs,id', // Validation du tuteur choisi
        ]);

        return DB::transaction(function () use ($request) {
            $userConnecte = Auth::user();

            // Détermination du tuteur : soit celui choisi dans la recherche, soit l'utilisateur connecté
            $tuteurId = $request->parent_id ?? $userConnecte->id;

            if ($request->type === 'soi_meme') {
                // CAS : L'adulte crée son propre dossier
                $patient = Patient::create([
                    'utilisateur_id' => $userConnecte->id,
                    'enfant_id' => null,
                    'adresse' => $request->adresse,
                    'groupe_sanguin' => $request->groupe_sanguin,
                    'taille' => $request->taille,
                    'poids' => $request->poids,
                ]);
                $typeLog = "Adulte Autonome";
            } else {
                // CAS : Création d'un enfant sous la tutelle de $tuteurId
                $enfant = Enfant::create([
                    'parent_id' => $tuteurId,
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
                $typeLog = "Enfant sous tutelle (Tuteur ID: $tuteurId)";
            }

            // TRACABILITÉ : Respect de tes règles d'audit
            Tracabilite::create([
                'utilisateur_id' => $userConnecte->id,
                'action' => 'création_dossier',
                'nom_table' => 'patients',
                'nouvelle_valeur' => "Type: $typeLog | Patient ID: {$patient->id} | Numéro: {$patient->numero_patient}"
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Dossier médical créé avec succès',
                'data' => [
                    'patient_id' => $patient->id,
                    'numero_patient' => $patient->numero_patient,
                    'nom_complet' => ($request->type === 'soi_meme')
                        ? "$userConnecte->nom $userConnecte->prenom"
                        : "$request->nom $request->prenom"
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

    // /**
    //  * Création d'un NOUVEAU patient par l'accueil (Création de compte + Dossier)
    //  */
    public function store(Request $request)
    {
        // 1. Formatage des numéros (Bénin)
        if ($request->has('tel')) {
            $request->merge(['tel' => \App\Helpers\PhoneHelper::formatBeninTel($request->tel)]);
        }
        if ($request->has('whatsapp')) {
            $request->merge(['whatsapp' => \App\Helpers\PhoneHelper::formatBeninWhatsApp($request->whatsapp)]);
        }

        \Illuminate\Support\Facades\Log::info("Requête création patient reçue", $request->all());

        // 2. Vérification des permissions
        if (!$request->user()->hasPermission('creer_patients')) {
            return response()->json(['message' => 'Action non autorisée.'], 403);
        }

        // 3. Validation des données
        $request->validate([
            'nom' => 'required|string|max:50',
            'prenom' => 'required|string|max:50',
            'tel' => 'nullable|string|unique:utilisateurs,tel',
            'whatsapp' => 'nullable|string|unique:utilisateurs,whatsapp',
            'sexe' => 'required|in:Homme,Femme',
            'date_naissance' => 'nullable|date',
            'ville' => 'nullable|string',
            'adresse' => 'nullable|string',
            'groupe_sanguin' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'taille' => 'nullable|numeric',
            'poids' => 'nullable|numeric',
        ], [
            'tel.unique' => 'Ce numéro de téléphone est déjà utilisé.',
            'whatsapp.unique' => 'Ce numéro WhatsApp est déjà utilisé.',
            'nom.required' => 'Le nom est obligatoire.',
            'prenom.required' => 'Le prénom est obligatoire.',
        ]);

        if (empty($request->tel) && empty($request->whatsapp)) {
            return response()->json(['message' => 'Un numéro de téléphone ou WhatsApp est requis.'], 422);
        }

        try {
            // Utilisation d'une transaction pour garantir l'intégrité des données
            return DB::transaction(function () use ($request) {

                // A. Création Utilisateur (Le mot de passe est haché et ne sera JAMAIS renvoyé)
                $user = Utilisateur::create([
                    'nom' => $request->nom,
                    'prenom' => $request->prenom,
                    'tel' => $request->tel,
                    'whatsapp' => $request->whatsapp,
                    'mot_de_passe' => \Illuminate\Support\Facades\Hash::make('password'), // À changer par le patient
                    'role' => 'patient',
                    'sexe' => $request->sexe,
                    'date_naissance' => $request->date_naissance,
                    'ville' => $request->ville,
                    'date_creation' => now(),
                    'date_modification' => now()
                ]);

                // B. Création de l'entrée Patient
                $patient = Patient::create([
                    'utilisateur_id' => $user->id,
                    'adresse' => $request->adresse,
                    'groupe_sanguin' => $request->groupe_sanguin,
                    'taille' => $request->taille,
                    'poids' => $request->poids,
                ]);

                // C. Initialisation de la connexion
                \App\Models\Connexion::create([
                    'utilisateur_id' => $user->id,
                    'premiere_connexion' => true
                ]);

                // D. ENVOI NOTIFICATION (Isolé dans un try/catch pour ne pas faire échouer la transaction)
                try {
                    $this->sendActivationNotification($user);
                } catch (\Exception $e) {
                    // On log l'erreur mais on laisse la transaction continuer
                    \Illuminate\Support\Facades\Log::error("Erreur Notification Twilio : " . $e->getMessage());
                }

                // E. Traçabilité (Audit log)
                Tracabilite::create([
                    'utilisateur_id' => $request->user()->id,
                    'action' => 'création',
                    'nom_table' => 'patients',
                    'nouvelle_valeur' => "Création Patient + Compte User ID: {$user->id} (Numéro: {$patient->numero_patient})"
                ]);

                // F. RÉPONSE SÉCURISÉE (On ne renvoie pas le mot de passe, même haché)
                return response()->json([
                    'status' => 'success',
                    'message' => 'Patient et compte utilisateur créés avec succès.',
                    'data' => [
                        'id' => $patient->id,
                        'numero_patient' => $patient->numero_patient,
                        'nom' => $user->nom,
                        'prenom' => $user->prenom,
                        'tel' => $user->tel
                    ]
                ], 201);
            });

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Échec critique création patient : " . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la création : ' . $e->getMessage()], 500);
        }
    }

    private function sendActivationNotification($user)
    {
        $identifier = $user->whatsapp ?? $user->tel;
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $activationLink = rtrim($frontendUrl, '/') . "/first-login?connexion=" . $identifier;
        $message = "Bienvenue sur DME (Patient).\nVotre dossier est ouvert.\nActivez votre compte pour y accéder :\n$activationLink";

        $twilio = new \App\Services\TwilioService();

        if ($user->whatsapp) {
            $twilio->sendWhatsApp($user->whatsapp, $message);
        }

        if ($user->tel) {
            $twilio->sendSMS($user->tel, $message);
        }
    }







    public function rechercherTuteur(Request $request)
    {
        try {
            $search = $request->query('q');

            // Sécurité : si la recherche est vide, on arrête tout de suite
            if (!$search || strlen($search) < 2) {
                return response()->json([]);
            }

            $tuteurs = Utilisateur::where('role', 'patient')
                ->where(function ($query) use ($search) {
                    $query->where('nom', 'like', "%{$search}%")
                        ->orWhere('prenom', 'like', "%{$search}%")
                        ->orWhere('tel', 'like', "%{$search}%");
                })
                // Respect de tes consignes : pas de mot de passe ici
                ->select(['id', 'nom', 'prenom', 'tel', 'whatsapp', 'sexe'])
                ->with([
                    'enfants' => function ($query) {
                        $query->select('id', 'parent_id', 'nom', 'prenom');
                    }
                ])
                ->limit(5)
                ->get();

            return response()->json($tuteurs);

        } catch (\Exception $e) {
            // Cela transformera l'erreur 500 en un message lisible par ton Frontend
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur SQL ou Modèle : ' . $e->getMessage()
            ], 500);
        }
    }


    public function update(Request $request, $id)
    {
        // 1. On récupère le patient (soit par son ID propre, soit par son ID utilisateur)
        $patient = Patient::where('id', $id)
            ->orWhere('utilisateur_id', $id)
            ->firstOrFail();

        // 2. Préparation des règles de validation de base
        $rules = [
            'ville' => 'nullable|string|max:100',
            'adresse' => 'nullable|string|max:255',
            'taille' => 'nullable|numeric',
            'poids' => 'nullable|numeric',
            'groupe_sanguin' => 'nullable|string|max:10',
            'date_naissance' => 'nullable|date',
            'nom' => 'sometimes|string|max:100',
            'prenom' => 'sometimes|string|max:100',
        ];

        // 3. Logique spécifique si c'est un patient autonome (avec compte utilisateur)
        if ($patient->utilisateur_id) {
            $userId = $patient->utilisateur_id;

            // On ajoute la règle de téléphone unique en IGNORANT l'utilisateur actuel
            $rules['tel'] = [
                'sometimes',
                'string',
                Rule::unique('utilisateurs', 'tel')->ignore($userId),
            ];
            $rules['whatsapp'] = 'nullable|string';
            $rules['sexe'] = 'sometimes|in:Homme,Femme,Masculin,Féminin';
        }

        // 4. Validation des données
        $validated = $request->validate($rules);

        try {
            DB::beginTransaction();

            // 5. Mise à jour de la table Utilisateurs (si Adulte)
            if ($patient->utilisateur_id) {
                $utilisateur = Utilisateur::findOrFail($patient->utilisateur_id);

                // IMPORTANT: On ne met à jour QUE les champs autorisés (Pas de mot de passe !)
                $utilisateur->update($request->only([
                    'nom',
                    'prenom',
                    'tel',
                    'whatsapp',
                    'sexe'
                ]));
            }

            // 6. Mise à jour de la table Patients (Infos médicales)
            $patient->update($request->only([
                'nom',
                'prenom',
                'ville',
                'adresse',
                'taille',
                'poids',
                'groupe_sanguin',
                'date_naissance'
            ]));

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Dossier patient mis à jour avec succès',
                'data' => $patient->load('utilisateur')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la mise à jour : ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Affiche les détails d'un dossier patient (Adulte ou Enfant)
     */
    public function show($id)
    {
        // 1. On récupère le dossier patient avec ses relations
        // On utilise 'utilisateur' pour les adultes et 'enfant' pour les petits
        $patient = Patient::with(['utilisateur', 'enfant'])->find($id);

        if (!$patient) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dossier patient introuvable'
            ], 404);
        }

        // 2. On prépare une réponse propre qui respecte tes règles de sécurité
        // Le mot de passe est automatiquement exclu si défini dans $hidden sur le modèle Utilisateur
        return response()->json($patient);
    }

}
