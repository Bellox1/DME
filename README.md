# DME - Dossier Médical Électronique

## Description

Plateforme web de gestion des dossiers médicaux pour les établissements de santé. Permet la digitalisation et la centralisation des informations médicales des patients.

## Fonctionnalités

### Patients
- Consultation du profil médical
- Gestion des rendez-vous
- Accès aux prescriptions
- etc.

### Médecins
- Gestion des dossiers patients
- Création de consultations et prescriptions
- Agenda des rendez-vous
- etc.

### Personnel d'accueil
- Gestion des rendez-vous
- Enregistrement des patients
- etc.

### Administrateurs
- Gestion des utilisateurs et rôles
- Contrôle global de la plateforme
- etc.

## Technologies

### Backend
![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![REST API](https://img.shields.io/badge/REST_API-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)

### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## Installation

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configurer .env avec vos paramètres MySQL
mysql -u root -p -e "CREATE DATABASE DME;"
php artisan migrate
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```