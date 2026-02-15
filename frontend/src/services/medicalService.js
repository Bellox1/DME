import api from './api';

const medicalService = {
    /**
     * Récupère la file d'attente du jour (ou d'une date spécifique).
     */
    getQueue: async (date = null) => {
        const params = date ? { date } : {};
        const response = await api.get('/queue', { params });
        return response.data;
    },

    /**
     * Met à jour le statut d'un rendez-vous.
     */
    updateRdvStatus: async (rdvId, statut) => {
        const response = await api.patch(`/rdvs/${rdvId}/status`, { statut });
        return response.data;
    },

    /**
     * Crée une nouvelle consultation.
     */
    createConsultation: async (data) => {
        const response = await api.post('/consultations', data);
        return response.data;
    },

    /**
     * Ajoute une prescription à une consultation.
     */
    addPrescription: async (consultationId, prescriptionData) => {
        const response = await api.post(`/consultations/${consultationId}/prescriptions`, prescriptionData);
        return response.data;
    },

    /**
     * Récupère l'historique médical d'un patient.
     */
    getPatientHistory: async (patientId) => {
        const response = await api.get(`/patients/${patientId}/history`);
        return response.data;
    },

    /**
     * Récupère tous les patients.
     */
    getPatients: async () => {
        const response = await api.get('/patients');
        return response.data;
    },

    /**
     * Recherche des patients.
     */
    searchPatients: async (query = '') => {
        const response = await api.get('/patients', { params: { search: query } });
        return response.data;
    },

    /**
     * Récupère toutes les consultations du médecin connecté.
     */
    getAllConsultations: async () => {
        const response = await api.get('/consultations');
        return response.data;
    },

    /**
     * Récupère une consultation spécifique par son ID.
     */
    getConsultation: async (id) => {
        const response = await api.get(`/consultations/${id}`);
        return response.data;
    },

    /**
     * Récupère tous les résultats d'examens.
     */
    getResultats: async () => {
        const response = await api.get('/resultats');
        return response.data;
    },

    /**
     * Récupère les résultats d'un patient spécifique.
     */
    getPatientResultats: async (patientId) => {
        const response = await api.get(`/patients/${patientId}/resultats`);
        return response.data;
    },

    /**
     * Génère l'URL du PDF de l'ordonnance.
     */
    getOrdonnancePdfUrl: (consultationId) => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
        return `${baseUrl}/consultations/${consultationId}/pdf`;
    }
};

export default medicalService;
