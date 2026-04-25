# 🏥 DME - Dossier Médical Électronique

**DME (Dossier Médical Électronique)** est une plateforme de santé de pointe conçue pour digitaliser et centraliser l'intégralité du parcours patient. Elle offre une synergie parfaite entre les patients, le corps médical et l'administration hospitalière pour une prise en charge plus rapide et sécurisée.

---

## 🌟 Fonctionnalités Maîtresses

*   **👨‍⚕️ Parcours Patient Digitalisé** : Gestion complète du dossier médical, de l'enregistrement à la prescription finale.
*   **📅 Agenda & File d'Attente** : Système intelligent de gestion des rendez-vous et suivi en temps réel de l'attente en clinique.
*   **🔐 Sécurité Multi-Rôles** : Contrôle d'accès granulaire (RBAC) pour Administrateurs, Médecins, Accueil et Patients.
*   **📱 Communication Twilio** : Alertes et notifications automatisées transmises par **SMS** et **WhatsApp**.
*   **💎 Design Premium** : Interfaces immersives fondées sur le Glassmorphism pour un confort visuel optimal.

---

## 🛠️ Stack Technologique

Le projet repose sur une architecture moderne et découplée pour une scalabilité maximale.

### Backend (Cœur de Données)
*   **Framework** : [Laravel 12](https://laravel.com/)
*   **Communication** : [Twilio API](https://www.twilio.com/) (SMS/WhatsApp)
*   **Sécurité** : [Laravel Sanctum](https://laravel.com/docs/sanctum) (Authentification API)
*   **Base de données** : SQLite / MySQL

### Frontend (Expérience Utilisateur)
*   **Framework** : [React](https://react.dev/) with [Vite](https://vitejs.dev/)
*   **Styling** : [Tailwind CSS](https://tailwindcss.com/)
*   **Gestion d'état** : React Hooks & Services API

---

## 🚀 Installation Rapide (Mode Dev)

### 1. Récupération du projet
```bash
git clone https://github.com/Bellox1/DME.git
cd DME
```

### 2. Configuration du Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite # Version SQLite
php artisan migrate --seed
php artisan serve --port=8002
```

### 3. Configuration du Frontend
```bash
cd ../frontend
npm install
npm run dev -- --port 5174
```

*L'application sera accessible sur [http://localhost:5174](http://localhost:5174) et l'API sur [http://localhost:8002](http://localhost:8002).*

---

## 👨‍💻 Développé par
**Bellox** - Architecte Solution & Développeur Fullstack.

---
## 📄 Licence
Ce projet est sous licence MIT.