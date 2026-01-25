# DME - Frontend (React + Vite)

## 🏥 Description
L'interface utilisateur moderne et responsive de la plateforme DME. Conçue pour offrir une expérience premium aux patients, médecins, personnel d'accueil et administrateurs.

## ✨ Fonctionnalités & Design

### 🎨 Design Premium
- **Tableaux de Bord Unifiés** : Design cohérent (max-w-[1600px]) pour tous les rôles.
- **Glassmorphism & Dégradés** : Esthétique soignée avec effets de flou et couleurs harmonieuses.
- **Responsive** : Adapté aux mobiles, tablettes et grands écrans.
- **Animations** : Transitions fluides entre les pages et micro-interactions.

### 🔑 Gestion de Compte
- **Première Connexion** : Page dédiée pour définir son mot de passe après activation.
- **Mot de Passe Oublié** : Interface pour demander et définir un nouveau mot de passe.
- **Profil Utilisateur** : Gestion des informations personnelles et sécurité.

### 👥 Espaces Dédiés
- **Espace Patient** : Suivi des constantes, historique, ordonnances, prise de RDV.
- **Espace Médecin** : Agenda, consultations, dossiers patients.
- **Espace Accueil** : Gestion file d'attente, enregistrement rapide.
- **Espace Admin** : Vue d'ensemble, logs, gestion utilisateurs.

## 🛠️ Installation

### Prérequis
- Node.js (LTS recommandé)
- npm

### Étapes
1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Configuration**
   Créez un fichier `.env` à la racine si nécessaire pour lier l'API :
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

3. **Lancer en développement**
   ```bash
   npm run dev
   ```

## 📁 Structure
- `src/pages/auth` : Pages de connexion, activation, reset mot de passe.
- `src/pages/patient` : Vues de l'espace Patient.
- `src/pages/medecin` : Vues de l'espace Médecin.
- `src/pages/admin` : Vues de l'espace Admin.
- `src/components` : Composants réutilisables (Layouts, Inputs, Modals...).
- `src/services` : Services API (AuthService, PatientService...).
