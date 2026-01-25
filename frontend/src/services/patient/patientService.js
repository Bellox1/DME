import api from '../api';

const patientService = {
    // --- DASHBOARD ---
    async getDashboardStats(patientId = null) {
        const url = patientId ? `/patient/dashboard?patient_id=${patientId}` : '/patient/dashboard';
        const response = await api.get(url);
        return response.data;
    },

    // --- DOSSIERS MEDICAUX ---
    // Lister tous les dossiers accessibles (Moi + Enfants) pour le sélecteur
    async getProfils() {
        const response = await api.get('/patient/profils');
        return response.data;
    },

    // Récupérer le détail complet d'un dossier
    async getDossier(patientId) {
        const response = await api.get(`/patient/dossier/${patientId}`);
        return response.data;
    },

    // --- COMPTE / PROFIL UTILISATEUR ---
    async getCompte() {
        const response = await api.get('/patient/compte');
        return response.data;
    },

    async updateCompte(data) {
        const response = await api.put('/patient/compte', data);
        return response.data;
    },

    async updatePassword(data) {
        const response = await api.post('/patient/compte/password', data);
        return response.data;
    },

    // --- RENDEZ-VOUS CONFIRMÉS ---

    // Lister mes rendez-vous confirmés (demandes approuvées)
    async getMesRdv() {
        const response = await api.get('/demande-rdv');
        // Filtrer uniquement les demandes approuvées qui sont devenues des RDV
        const demandesApprouvees = response.data.filter(demande => 
            demande.statut === 'approuvé' || demande.statut === 'approuve'
        );
        return demandesApprouvees;
    },

    // Annuler un rendez-vous (rejeter la demande)
    async annulerRdv(rdvId) {
        const response = await api.post(`/demande-rdv/${rdvId}/rejeter`, {
            motif_rejet: 'Annulation par le patient'
        });
        return response.data;
    },

    // --- ACCES MEDICAL (Lecture seule pour patient) ---
    async getMonHistorique(patientId) {
        const response = await api.get(`/patients/${patientId}/history`);
        return response.data;
    },

    async getExamens() {
        const response = await api.get('/patient/examens');
        return response.data;
    },

    async getAllActivities(patientId = null) {
        const url = patientId ? `/patient/activites?patient_id=${patientId}` : '/patient/activites';
        const response = await api.get(url);
        return response.data;
    },

    async getNotifications(patientId = null) {
        const url = patientId ? `/patient/notifications?patient_id=${patientId}` : '/patient/notifications';
        const response = await api.get(url);
        return response.data;
    },

    async createDemande(data) {
        const response = await api.post('/patient/demandes', data);
        return response.data;
    },

    // --- DEMANDES ---
    async getDemandes() {
        // A implémenter si route dispo
        return [];
    }
};

export default patientService;
