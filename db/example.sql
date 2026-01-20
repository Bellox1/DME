-- Liste des  identifiants , nom, prenom, tel de tout les utilisateurs utilisateurs --
SELECT id, nom, prenom, tel
FROM utilisateurs;

-- Liste des utilisateurs qui sont des patients --
SELECT DISTINCT u.id, u.nom, u.prenom, u.tel
FROM utilisateurs u
INNER JOIN patients p ON u.id = p.utilisateur_id;
-- ou --
SELECT id, nom, prenom, tel
FROM utilisateurs
WHERE role = 'patient';

-- Tous les comptes qui sont tuteurs --
SELECT id, nom, prenom, role, est_tuteur, date_creation, date_modification
FROM utilisateurs
WHERE est_tuteur = TRUE;


-- Vérifier si un utilisateur est admin --
SELECT id, nom, prenom, 
       (role = 'admin') AS est_admin
FROM utilisateurs
WHERE id = ?;  -- Remplacer ? par l'ID de l'utilisateur

-- ou  --
SELECT id, nom, prenom, tel,
       CASE 
           WHEN role = 'admin' THEN TRUE 
           ELSE FALSE 
       END AS est_admin
FROM utilisateurs;


-- Récupérer les permissions associées au rôle de l'utilisateur X (id = 1) --
SELECT u.id AS utilisateur_id,
       u.nom,
       u.prenom,
       u.role AS nom_role,
       p.id AS permission_id,
       p.nom AS permission_nom
FROM utilisateurs u
INNER JOIN roles r ON u.role = r.nom
INNER JOIN role_permissions rp ON r.id = rp.role_id
INNER JOIN permissions p ON rp.permission_id = p.id
WHERE u.id = 1;

-- Tous les patients autonomes (sans tuteur) --
SELECT p.id AS patient_id,
       p.nom,
       p.prenom,
       p.taille,
       p.poids,
       p.adresse,
       p.date_naissance,
       p.groupe_sanguin,
       p.date_creation,
       p.date_modification
FROM patients p
WHERE p.tuteur_id IS NULL;