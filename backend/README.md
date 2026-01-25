# DME - Backend (API Laravel)

## 🏥 Description
Le backend de la plateforme de Dossier Médical Électronique (DME). Il fournit une API RESTful sécurisée pour gérer les utilisateurs, les patients, les médecins, les rendez-vous et les dossiers médicaux.

## 🚀 Fonctionnalités Clés

### 🔐 Authentification & Sécurité
- **Connexion unifiée** : Support pour téléphone et WhatsApp.
- **Première Connexion Sécurisée** : Lien d'activation unique envoyé par SMS/WhatsApp.
- **Réinitialisation de Mot de Passe** : Flux sécurisé avec code temporaire envoyé par SMS/WhatsApp.
- **Gestion des Rôles** : Système RBAC (Admin, Médecin, Accueil, Patient).
- **Protection Sanctum** : Tokens API sécurisés pour toutes les requêtes.

### 📱 Intégration Twilio
- Envoi automatique de notifications SMS et WhatsApp.
- Configuration centralisée via `.env`.

### 👨‍⚕️ Gestion Médicale
- CRUD Patients, Médecins, Consultations, Ordonnances.
- Suivi des files d'attente en temps réel.

## 🛠️ Installation

### Prérequis
- PHP 8.2+
- Composer
- MySQL

### Étapes
1. **Installer les dépendances**
   ```bash
   composer install
   ```

2. **Configuration**
   Copiez le fichier d'exemple et générez la clé :
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Base de Données**
   Configurez votre `.env` avec vos accès MySQL, puis migrez :
   ```bash
   php artisan migrate --seed
   ```
   *Le seed créera les rôles et un administrateur par défaut.*

4. **Serveur**
   ```bash
   php artisan serve
   ```

## 📡 Endpoints Principaux

### Auth
- `POST /api/login` : Connexion
- `POST /api/register` : Inscription (Patient)
- `POST /api/check-activation` : Vérifier statut compte
- `POST /api/forgot-password` : Demande reset
- `POST /api/reset-password` : Reset effectif

### Gestion
- `GET /api/user` : Info utilisateur courant
- `GET /api/patients` : Liste patients
- `GET /api/consultations` : Liste consultations
