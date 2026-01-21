-- =====================================
-- EXEMPLES DE REQUÊTES - NOUVELLE STRUCTURE
-- =====================================

-- 1. Liste de tous les utilisateurs (Identité complète) --
SELECT id, nom, prenom, tel, ville, date_naissance, role
FROM utilisateurs;

-- 2. Liste des patients adultes (Autonomes) --
-- Identité venant de 'utilisateurs' et données médicales de 'patients'
SELECT u.nom, u.prenom, u.tel, p.taille, p.poids, p.groupe_sanguin
FROM utilisateurs u
INNER JOIN patients p ON u.id = p.utilisateur_id
WHERE u.role = 'patient';

-- 3. Liste des enfants patients (Sous-comptes) --
-- Identité venant de 'enfants' et données médicales de 'patients'
SELECT e.nom, e.prenom, e.sexe, e.date_naissance, p.taille, p.poids, p.groupe_sanguin
FROM enfants e
INNER JOIN patients p ON e.id = p.enfant_id;

-- 4. Trouver tous les enfants rattachés à un parent spécifique (ex: ID 1) --
SELECT e.nom, e.prenom, e.date_naissance
FROM enfants e
WHERE e.parent_id = 1;

-- 5. Liste complète de TOUS les patients (Adultes + Enfants) avec leur identité --
-- Utilisation de COALESCE pour fusionner les sources d'identité
SELECT 
    p.id AS patient_id,
    COALESCE(u.nom, e.nom) AS nom,
    COALESCE(u.prenom, e.prenom) AS prenom,
    COALESCE(u.date_naissance, e.date_naissance) AS date_naissance,
    CASE 
        WHEN u.id IS NOT NULL THEN 'Adulte'
        ELSE 'Enfant'
    END AS type_patient,
    p.groupe_sanguin
FROM patients p
LEFT JOIN utilisateurs u ON p.utilisateur_id = u.id
LEFT JOIN enfants e ON p.enfant_id = e.id;

-- 6. Vérifier si un utilisateur a des sous-comptes (est un parent) --
SELECT u.id, u.nom, u.prenom,
       (SELECT COUNT(*) FROM enfants WHERE parent_id = u.id) AS nb_enfants
FROM utilisateurs u
WHERE u.id = 1;

-- 7. Récupérer les demandes en attente avec le nom du demandeur --
SELECT d.id, d.type, d.objet, d.date_creation, u.nom, u.prenom
FROM demandes d
INNER JOIN utilisateurs u ON d.utilisateur_id = u.id
WHERE d.statut = 'en_attente'
ORDER BY d.date_creation DESC;

-- 8. Historique des consultations d'un patient spécifique (ex: ID 5) --
-- Note: patient_id pointe toujours vers la table patients, peu importe le type
SELECT c.dateH_visite, c.motif, c.diagnostic, u_med.nom AS medecin
FROM consultations c
INNER JOIN utilisateurs u_med ON c.medecin_id = u_med.id
WHERE c.patient_id = 5;