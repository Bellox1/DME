# 🗺️ Routes de l'Application DME

## 🔐 Authentification
- `/login` - Page de connexion

## 👨‍💼 ADMIN
- `/admin` → Redirige vers `/admin/roles`
- `/admin/roles` - Gestion des rôles et permissions
- `/admin/inscription` - Inscription multi-contact (créer utilisateurs)
- `/admin/utilisateurs` - Liste des utilisateurs

## 👨‍⚕️ MÉDECIN
- `/medecin` → Redirige vers `/medecin/dashboard`
- `/medecin/dashboard` - Tableau de bord médecin
- `/medecin/patients` - Liste des patients
- `/medecin/patient/:id` - Dossier complet d'un patient
- `/medecin/calendrier` - Calendrier des rendez-vous

## 🏥 ACCUEIL / RÉCEPTION
- `/accueil` → Redirige vers `/accueil/patients`
- `/accueil/patients` - Gestion des patients
- `/accueil/patient/:id` - Dossier patient
- `/accueil/calendrier` - Calendrier des rendez-vous

## 🧑‍🦱 PATIENT
- `/patient` → Redirige vers `/patient/dashboard`
- `/patient/dashboard` - Tableau de bord patient
- `/patient/profil` - Profil médical

## 🔄 Routes Communes (accessibles par plusieurs rôles)
- `/calendrier` - Calendrier
- `/patients` - Liste patients
- `/patient/:id` - Dossier patient

## 🏠 Redirections
- `/` → `/login`
- `*` (route inexistante) → `/login`

---

## 📁 Organisation des fichiers

```
src/pages/
├── auth/
│   └── Login.jsx
├── admin/
│   ├── Roles.jsx
│   └── Registration.jsx
├── medecin/
│   ├── Dashboard.jsx
│   └── DossierPatient.jsx
├── accueil/
│   ├── GestionPatients.jsx
│   └── Calendrier.jsx
└── patient/
    └── Dashboard.jsx
```

## 🎨 Thème Global
Le thème (clair/sombre) est géré globalement via `ThemeContext` et persiste dans `localStorage`.
Utilisez le composant `<ThemeToggle />` pour changer de thème partout dans l'app.
