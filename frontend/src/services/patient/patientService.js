import api from '../api';

const patientService = {
    // --- GESTION DOSSIERS ---

    // Créer un dossier (soi-même ou enfant)
    async enregistrerPatient(data) {
        // data: { type, nom, prenom, sexe, date_naissance, etc... }
        const response = await api.post('/patients/enregistrer', data);
        return response.data;
    },

    // Récupérer mes dossiers (Moi + Enfants)
    async getMesDossiers() {
        const response = await api.get('/mes-dossiers');
        return response.data;
    },

    // Ajouter un enfant (Autre méthode si utilisée)
    async createEnfant(enfantData) {
        const response = await api.post('/enfants', enfantData);
        return response.data;
    },


    // --- DEMANDES DE RDV ---

    // Créer une demande
    async createDemandeRdv(demandeData) {
        const response = await api.post('/demande-rdv', demandeData);
        return response.data;
    },

    // Lister mes demandes
    async getMesDemandes() {
        const response = await api.get('/demande-rdv');
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
    }
};

export default patientService;
