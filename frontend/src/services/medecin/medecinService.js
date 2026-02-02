import api from '../api';

const medecinService = {
    // --- CONSULTATIONS ---

    // Créer une consultation
    async createConsultation(data) {
        const response = await api.post('/consultations', data);
        return response.data;
    },

    // Voir une consultation
    async getConsultation(id) {
        const response = await api.get(`/consultations/${id}`);
        return response.data;
    },

    // Mettre à jour une consultation
    async updateConsultation(id, data) {
        const response = await api.put(`/consultations/${id}`, data);
        return response.data;
    },


    // --- PRESCRIPTIONS ---

    // Ajouter une prescription à une consultation
    async addPrescription(consultationId, data) {
        const response = await api.post(`/consultations/${consultationId}/prescriptions`, data);
        return response.data;
    },

    // Supprimer une prescription
    async deletePrescription(id) {
        const response = await api.delete(`/prescriptions/${id}`);
        return response.data;
    },


    // --- ORDONNANCES ---

    // Générer PDF Ordonnance
    async generateOrdonnancePdf(consultationId) {
        const response = await api.get(`/consultations/${consultationId}/pdf`, {
            responseType: 'blob' // Important pour le téléchargement de fichier
        });
        return response; // On retourne la réponse brute pour gérer le blob
    },


    // --- HISTORIQUE & PATIENTS (Vue Médecin) ---

    // Historique complet d'un patient
    async getPatientHistory(patientId) {
        const response = await api.get(`/patients/${patientId}/history`);
        return response.data;
    },

    // --- AGENDA ---
    // Récupérer les RDV du médecin connecté
    async getAgenda(medecinId, date = null) {
        const params = { medecin_id: medecinId };
        if (date) params.date = date; // Format attendu: YYYY-MM-DD
        const response = await api.get('/rdvs', { params });
        return response.data;
    },

    // Liste des patients (pour recherche)
    async searchPatients(query, filters = {}) {
        const response = await api.get('/patients', { params: { search: query, ...filters } });
        return response.data;
    },

    // Récupérer les statistiques du médecin
    async getStats() {
        const response = await api.get('/stats');
        return response.data;
    },

    // --- PROFIL ---
    async updateProfile(data) {
        const response = await api.post('/profile/update', data);
        return response.data;
    },

    async updatePassword(data) {
        const response = await api.post('/profile/password', data);
        return response.data;
    },

    async updatePhoto(formData) {
        const response = await api.post('/profile/photo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export default medecinService;
