-- =====================================
-- BASE DE DONNEES DME - PRESCRIPTIONS SIMPLIFIEES
-- =====================================

-- ------------------------------
-- Table des rôles
-- ------------------------------
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------
-- Table des permissions
-- ------------------------------
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------
-- Table pivot rôle → permissions
-- ------------------------------
CREATE TABLE role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- ------------------------------
-- Table des utilisateurs
-- ------------------------------
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,

    tel VARCHAR(20) NOT NULL UNIQUE,       -- numéro de téléphone unique, identifiant
    whatsapp VARCHAR(20) UNIQUE NULL,      -- optionnel, peut être différent du tel    mot_de_passe VARCHAR(255) NOT NULL,
    sexe ENUM('Homme','Femme') NOT NULL,
    role ENUM('admin', 'accueil', 'medecin', 'patient') NOT NULL,
    est_tuteur BOOLEAN DEFAULT 0,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------
-- Table des patients
-- ------------------------------
CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    taille DECIMAL(5,2) NULL,
    poids DECIMAL(5,2) NULL,
    adresse VARCHAR(255) NULL,
    date_naissance DATE NULL,
    groupe_sanguin ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NULL,
    tuteur_id INT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (tuteur_id) REFERENCES utilisateurs(id) ON DELETE SET NULL
);

-- ------------------------------
-- Table des consultations
-- ------------------------------
CREATE TABLE consultations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    medecin_id INT NOT NULL,
    dateH_visite DATETIME NOT NULL,
    motif VARCHAR(255) NULL,
    antecedents TEXT NULL,
    allergies TEXT NULL,
    diagnostic TEXT NULL,
    observations_medecin TEXT NULL,
    traitement TEXT NULL,
    duree_traitement VARCHAR(50) NULL, -- ex: "5 jours"
    prix DECIMAL(10,2) NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (medecin_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- ------------------------------
-- Table des prescriptions
-- ------------------------------
CREATE TABLE prescriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    consultation_id INT NOT NULL,
    medecin_id INT NOT NULL,
    nom_medicament VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    instructions TEXT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE,
    FOREIGN KEY (medecin_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- ------------------------------
-- Table des rendez-vous
-- ------------------------------
CREATE TABLE rdvs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dateH_rdv DATETIME NOT NULL,
    statut ENUM('programmé','annulé','passé') DEFAULT 'programmé',
    patient_id INT NOT NULL,
    medecin_id INT NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (medecin_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- ------------------------------
-- Table de traçabilité
-- ------------------------------
CREATE TABLE tracabilites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dateH DATETIME DEFAULT CURRENT_TIMESTAMP,
    utilisateur_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,        -- type d'action : création, modification, suppression
    nom_table VARCHAR(100) NOT NULL,    -- sur quelle table
    champ VARCHAR(100) NULL,             -- quel champ modifié
    ancienne_valeur TEXT NULL,           -- valeur avant modification
    nouvelle_valeur TEXT NULL,           -- valeur après modification
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);