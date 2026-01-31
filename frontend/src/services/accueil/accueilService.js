import api from '../api';

const accueilService = {
    // Liste des patients
    async getPatients(params = {}) {
        try {
            const response = await api.get('/patients', { params });
            const rawData = response.data.data || response.data;
            return rawData.map(p => {
                const info = p.utilisateur || p.enfant || {};
                return {
                    id: p.id,
                    nom: info.nom || 'N/A',
                    prenom: info.prenom || '',
                    tel: info.tel || 'Pas de numéro',
                    type: p.enfant_id ? 'Enfant' : 'Autonome',
                    derniere_visite: p.date_modification || p.date_creation,
                    whatsapp: info.whatsapp || null
                };
            });
        } catch (error) {
            console.error("Erreur mapping patients:", error);
            throw error;
        }
    },

    // Récupérer UN patient pour le formulaire d'édition
    async getPatientById(id) {
        try {
            const response = await api.get(`/patients/${id}`);
            const p = response.data.data || response.data; // On gère le wrapper 'data' de Laravel

            const info = p.utilisateur || p.enfant || {};

            return {
                id: p.id,
                utilisateur_id: p.utilisateur_id,
                enfant_id: p.enfant_id,
                nom: info.nom || '',
                prenom: info.prenom || '',
                tel: info.tel || '',
                sexe: info.sexe || '',
                ville: p.ville || '',
                taille: p.taille || '',
                poids: p.poids || '',
                groupe_sanguin: p.groupe_sanguin || '',
                date_naissance: p.date_naissance || info.date_naissance || '',
                adresse: p.adresse || '',
                whatsapp: info.whatsapp || '',
                type: p.enfant_id ? 'Enfant' : 'Autonome'
            };
        } catch (error) {
            console.error("Erreur récupération:", error);
            throw error;
        }
    },

    // Mettre à jour (Le cœur du problème)
    async updatePatient(id, data) {
        try {
            // Sécurité : On ne garde que ce dont le backend a besoin
            // Et on s'assure que le mot de passe n'est JAMAIS inclus
            const { password: _pw, access_token: _tk, type: _t, ...payload } = data;
            // On utilise toujours l'ID du PATIENT dans l'URL
            // Le backend se chargera de trouver l'utilisateur lié
            const response = await api.put(`/patients/${id}`, payload);

            return response.data;
        } catch (error) {
            // On extrait le message d'erreur précis (ex: "The tel has already been taken")
            const errorMsg = error.response?.data?.errors?.tel?.[0]
                || error.response?.data?.message
                || "Erreur lors de la mise à jour";

            console.error("Détails erreur API:", error.response?.data);
            throw new Error(errorMsg);
        }
    }
};

export default accueilService;