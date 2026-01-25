import api from '../api';

const accueilService = {
    // --- FILE D'ATTENTE & RDV ---

    // Récupérer la file d'attente (Aujourd'hui)
    async getQueue() {
        const response = await api.get('/queue');
        return response.data;
    },

    // Changer le statut d'un RDV (en attente -> en cours -> terminé)
    async updateRdvStatus(rdvId, status) {
        const response = await api.patch(`/rdvs/${rdvId}/status`, { statut: status });
        return response.data;
    },

    // Valider une demande de RDV en RDV effectif
    async validateDemandeRdv(demandeId, data) {
        // data: { jour, heure_debut, medecin_id, ... }
        const response = await api.patch(`/demande-rdv/${demandeId}/valider`, data);
        return response.data;
    },


    // --- GESTION PATIENTS ---

    // Lister les patients (avec recherche)
    async getPatients(params = {}) {
        const response = await api.get('/patients', { params });
        return response.data;
    },

    // Enregistrer un nouveau patient (Guichet)
    async registerPatient(data) {
        const response = await api.post('/patients/enregistrer', data);
        return response.data;
    },


    // --- CAISSE & PAIEMENTS ---

    // Encaisser une consultation
    async encaisserConsultation(consultationId, paiementData) {
        // paiementData: { paye: true, mode_paiement: 'Espèces' }
        const response = await api.patch(`/consultations/${consultationId}/paiement`, paiementData);
        return response.data;
    },

    // Stats Journalières
    async getDailyPaiementStats() {
        const response = await api.get('/stats/paiements/jour');
        return response.data;
    }
};

export default accueilService;
