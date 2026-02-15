import api from '../api';
import sousCompteService from './sousCompteService';

const patientService = {
    // --- DASHBOARD ---
    async getDashboardStats(patientId = null) {
        const params = sousCompteService.preparerParamsAvecPatientId({}, patientId);
        const url = sousCompteService.construireUrlAvecPatientId('/patient/dashboard', params);
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
        // Valider l'accès au patient
        const aAcces = await sousCompteService.validerAccesPatient(patientId);
        if (!aAcces) {
            throw new Error('Accès non autorisé à ce dossier');
        }
        
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
    async getMesRdv(patientId = null) {
        const params = sousCompteService.preparerParamsAvecPatientId({}, patientId);
        const url = sousCompteService.construireUrlAvecPatientId('/demande-rdv', params);
        const response = await api.get(url);
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

    async getExamens(patientId = null) {
        const params = sousCompteService.preparerParamsAvecPatientId({}, patientId);
        const url = sousCompteService.construireUrlAvecPatientId('/patient/examens', params);
        const response = await api.get(url);
        return response.data;
    },

    async getAllActivities(patientId = null) {
        const params = sousCompteService.preparerParamsAvecPatientId({}, patientId);
        const url = sousCompteService.construireUrlAvecPatientId('/patient/activites', params);
        const response = await api.get(url);
        return response.data;
    },

    async getNotifications(patientId = null) {
        const params = sousCompteService.preparerParamsAvecPatientId({}, patientId);
        const url = sousCompteService.construireUrlAvecPatientId('/patient/notifications', params);
        const response = await api.get(url);
        return response.data;
    },

    async createDemande(data) {
        const response = await api.post('/patient/demandes', data);
        return response.data;
    },

    // Créer une demande de rendez-vous
    async createDemandeRdv(data) {
        // Le patient_id est maintenant ajouté directement dans le composant
        // Plus besoin de vérifier ici pour éviter la double injection
        const response = await api.post('/demande-rdv', data);
        return response.data;
    },

    // --- DEMANDES ---
    async getDemandes() {
        // A implémenter si route dispo
        return [];
    },

    // Récupérer les demandes de l'utilisateur connecté
    async getMesDemandes(patientId = null) {
        const params = sousCompteService.preparerParamsAvecPatientId({}, patientId);
        const url = sousCompteService.construireUrlAvecPatientId('/demande-rdv', params);
        const response = await api.get(url);
        return response.data;
    },

    // --- STATISTIQUES DES DEMANDES ---
    async getDemandeStats(patientId = null) {
        const params = sousCompteService.preparerParamsAvecPatientId({}, patientId);
        const url = sousCompteService.construireUrlAvecPatientId('/demande-rdv/stats', params);
        try {
            const response = await api.get(url);
            return response.data;
        } catch {
            // Si l'endpoint n'existe pas, calculer localement
            const demandes = await this.getMesDemandes(patientId);
            return {
                total: demandes.length,
                en_attente: demandes.filter(d => d.statut === 'en_attente').length,
                approuvees: demandes.filter(d => d.statut === 'approuvé').length,
                rejetees: demandes.filter(d => d.statut === 'rejeté').length
            };
        }
    },

    // --- UTILITAIRES POUR LES SOUS-COMPTES ---

    /**
     * Obtenir les données filtrées par profil actuel
     * @param {string} typeDonnees - Type de données ('demandes', 'rdv', 'ordonnances', etc.)
     * @returns {Promise<Array>} Données filtrées
     */
    async getDonneesParProfil(typeDonnees) {
        const patientId = sousCompteService.getPatientId();
        
        switch (typeDonnees) {
            case 'demandes':
                return this.getMesDemandes(patientId);
            case 'demande-stats':
                return this.getDemandeStats(patientId);
            case 'rdv':
                return this.getMesRdv(patientId);
            case 'ordonnances':
                // Importer prescriptionService si nécessaire ou appeler directement
                return import('./prescriptionService').then(module => 
                    module.default.getMesOrdonnances(patientId)
                );
            case 'ordonnance-stats':
                return import('./prescriptionService').then(module => 
                    module.default.getOrdonnanceStats(patientId)
                );
            case 'dashboard':
                return this.getDashboardStats(patientId);
            case 'activites':
                return this.getAllActivities(patientId);
            case 'notifications':
                return this.getNotifications(patientId);
            case 'examens':
                return this.getExamens(patientId);
            default:
                throw new Error(`Type de données non supporté: ${typeDonnees}`);
        }
    },

    /**
     * Créer une demande pour un profil spécifique
     * @param {Object} data - Données de la demande
     * @param {string} patientIdCible - ID du patient cible
     * @returns {Promise<Object>} Demande créée
     */
    async createDemandePourProfil(data, patientIdCible = null) {
        const patientId = patientIdCible || sousCompteService.getPatientId();
        
        // Valider l'accès au profil cible
        if (patientIdCible) {
            const aAcces = await sousCompteService.validerAccesPatient(patientIdCible);
            if (!aAcces) {
                throw new Error('Accès non autorisé à ce profil');
            }
        }
        
        const dataAvecPatient = patientId ? { ...data, patient_id: patientId } : data;
        return this.createDemandeRdv(dataAvecPatient);
    },

    /**
     * Obtenir les statistiques combinées pour tous les profils
     * @returns {Promise<Object>} Statistiques globales
     */
    async getStatsGlobales() {
        // Forcer l'utilisation de 'all' pour obtenir toutes les données
        return this.getDashboardStats('all');
    },

    /**
     * Synchroniser le profil actuel avec le backend
     * @returns {Promise<Object>} Profil synchronisé
     */
    async synchroniserProfilActuel() {
        const profilActuel = sousCompteService.getProfilActuel();
        if (!profilActuel) {
            throw new Error('Aucun profil actuel défini');
        }
        
        // Valider que le profil est toujours accessible
        const profils = await this.getProfils();
        const profilExiste = profils.find(p => p.id === profilActuel.id);
        
        if (!profilExiste) {
            // Le profil n'existe plus, réinitialiser au titulaire
            sousCompteService.resetToTitulaire();
            throw new Error('Le profil sélectionné n\'est plus accessible. Retour au profil titulaire.');
        }
        
        return profilExiste;
    }
};

export default patientService;
