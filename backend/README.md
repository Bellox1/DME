# ⚙️ DME - Backend API (Laravel)

Le cœur de données de la plateforme **DME**. Ce backend fournit une API RESTful sécurisée, hautement performante et intégrée aux services de communication mobile.

---

## ⚡ Fonctionnalités Clés

*   **🔐 Authentification Hybride** : Support natif pour la connexion par téléphone et WhatsApp via **Laravel Sanctum**.
*   **📱 Moteur de Notification Twilio** : Système d'envoi automatique de codes d'activation et de rappels médicaux par SMS/WhatsApp.
*   **📂 Gestion Médicale Avancée** : CRUD optimisé pour les Consultations, Ordonnances, Examens et Résultats.
*   **🛡️ Sécurité RBAC** : Middleware personnalisé gérant les rôles spécifiques (Administrateur, Médecin, Accueil, Patient).
*   **📊 Logs & Traçabilité** : Suivi des transactions et des activités pour une conformité de données maximale.

---

## 🛠️ Stack Technique

*   **Logic** : Laravel 12 (PHP 8.3+)
*   **Database** : Support SQLite/MySQL/PostgreSQL
*   **SMS/WhatsApp** : Twilio Integration
*   **Documentation** : API Endpoints structurés

---

## 🚀 Installation & Lancement

```bash
# 1. Installation
composer install

# 2. Configuration
cp .env.example .env
php artisan key:generate

# 3. Base de données (Mode SQLite rapide)
touch database/database.sqlite
php artisan migrate --seed

# 4. Lancement
php artisan serve --port=8002
```

---

## 📡 Endpoints Stratégiques

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/login` | Authentification unifiée |
| **POST** | `/api/register` | Inscription Patient |
| **GET** | `/api/patients` | Liste des dossiers patients (Médecin/Admin) |
| **POST** | `/api/consultations` | Création de consultation & Ordonnance |

---

## 📄 Licence
Ce projet est sous licence MIT.
