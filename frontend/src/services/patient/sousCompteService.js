import api from '../api';

const sousCompteService = {
    // --- GESTION DES PROFILS (SOUS-COMPTES) ---

    /**
     * Récupérer tous les profils accessibles (titulaire + enfants)
     * @returns {Promise<Array>} Liste des profils avec id, nom_affichage, type
     */
    async getProfilsDisponibles() {
        try {
            const response = await api.get('/patient/profils');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des profils:', error);
            throw error;
        }
    },

    /**
     * Récupérer le profil actuel sélectionné (depuis le localStorage)
     * @returns {Object|null} Profil actuel ou null
     */
    getProfilActuel() {
        try {
            const profilActuel = localStorage.getItem('profilActuel');
            return profilActuel ? JSON.parse(profilActuel) : null;
        } catch (error) {
            console.error('Erreur lors de la lecture du profil actuel:', error);
            return null;
        }
    },

    /**
     * Définir le profil actuel
     * @param {Object} profil - Profil à définir comme actuel
     */
    setProfilActuel(profil) {
        try {
            localStorage.setItem('profilActuel', JSON.stringify(profil));
            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du profil actuel:', error);
            return false;
        }
    },

    /**
     * Réinitialiser au profil titulaire
     */
    resetToTitulaire() {
        try {
            localStorage.removeItem('profilActuel');
            return true;
        } catch (error) {
            console.error('Erreur lors de la réinitialisation du profil:', error);
            return false;
        }
    },

    /**
     * Vérifier si le profil actuel est le titulaire
     * @returns {boolean}
     */
    isTitulaire() {
        const profilActuel = this.getProfilActuel();
        return !profilActuel || profilActuel.type === 'Titulaire';
    },

    /**
     * Vérifier si le profil actuel est un enfant
     * @returns {boolean}
     */
    isEnfant() {
        const profilActuel = this.getProfilActuel();
        return profilActuel && profilActuel.type === 'Enfant';
    },

    /**
     * Obtenir le patient_id à utiliser pour les requêtes API
     * @param {string|null} patientIdForcé - Patient_id spécifique à forcer
     * @returns {string|null} patient_id à utiliser
     */
    getPatientId(patientIdForcé = null) {
        // Si un patient_id est forcé, l'utiliser
        if (patientIdForcé) {
            return patientIdForcé;
        }

        // Sinon, utiliser le profil actuel
        const profilActuel = this.getProfilActuel();
        return profilActuel ? profilActuel.id : null;
    },

    /**
     * Obtenir le nom d'affichage du profil actuel
     * @returns {string}
     */
    getNomProfilActuel() {
        const profilActuel = this.getProfilActuel();
        return profilActuel ? profilActuel.nom_affichage : 'Moi';
    },

    /**
     * Filtrer les données pour n'afficher que celles du profil actuel
     * @param {Array} données - Données à filtrer
     * @param {string} champId - Champ contenant l'ID du patient
     * @returns {Array} Données filtrées
     */
    filterByProfilActuel(données, champId = 'patient_id') {
        const profilActuel = this.getProfilActuel();
        if (!profilActuel) {
            return données; // Pas de filtre si pas de profil actuel
        }

        return données.filter(item => item[champId] === profilActuel.id);
    },

    /**
     * Préparer les paramètres de requête avec le patient_id approprié
     * @param {Object} params - Paramètres existants
     * @param {string|null} patientIdForcé - Patient_id spécifique
     * @returns {Object} Paramètres avec patient_id ajouté si nécessaire
     */
    preparerParamsAvecPatientId(params = {}, patientIdForcé = null) {
        const patientId = this.getPatientId(patientIdForcé);
        
        if (patientId) {
            return { ...params, patient_id: patientId };
        }
        
        return params;
    },

    /**
     * Construire l'URL avec le patient_id approprié
     * @param {string} baseUrl - URL de base
     * @param {Object} params - Paramètres supplémentaires
     * @param {string|null} patientIdForcé - Patient_id spécifique
     * @returns {string} URL complète avec patient_id
     */
    construireUrlAvecPatientId(baseUrl, params = {}, patientIdForcé = null) {
        const patientId = this.getPatientId(patientIdForcé);
        const url = new URL(baseUrl, window.location.origin);
        
        // Ajouter le patient_id si nécessaire
        if (patientId) {
            url.searchParams.set('patient_id', patientId);
        }
        
        // Ajouter les autres paramètres
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                url.searchParams.set(key, value);
            }
        });
        
        return url.pathname + url.search;
    },

    /**
     * Gérer le changement de profil
     * @param {Object} nouveauProfil - Nouveau profil sélectionné
     * @param {Function} callback - Fonction de callback après le changement
     */
    changerProfil(nouveauProfil, callback = null) {
        try {
            this.setProfilActuel(nouveauProfil);
            
            // Notifier le changement de profil
            if (callback) {
                callback(nouveauProfil);
            }
            
            // Émettre un événement personnalisé pour les composants qui écoutent
            window.dispatchEvent(new CustomEvent('changementProfil', {
                detail: { profil: nouveauProfil }
            }));
            
            return true;
        } catch (error) {
            console.error('Erreur lors du changement de profil:', error);
            return false;
        }
    },

    /**
     * Initialiser le service avec le profil par défaut (titulaire)
     */
    async initialiser() {
        try {
            // Récupérer les profils disponibles
            const profils = await this.getProfilsDisponibles();
            
            // Si aucun profil actuel n'est défini, utiliser le titulaire
            if (!this.getProfilActuel() && profils.length > 0) {
                const titulaire = profils.find(p => p.type === 'Titulaire') || profils[0];
                this.setProfilActuel(titulaire);
            }
            
            return profils;
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du service de sous-compte:', error);
            throw error;
        }
    },

    /**
     * Obtenir des informations sur le profil pour l'affichage
     * @param {Object} profil - Profil concerné
     * @returns {Object} Informations formatées
     */
    getInfosProfil(profil) {
        return {
            ...profil,
            estTitulaire: profil.type === 'Titulaire',
            estEnfant: profil.type === 'Enfant',
            icone: profil.type === 'Titulaire' ? '👤' : '👶',
            couleur: profil.type === 'Titulaire' ? 'blue' : 'green'
        };
    },

    /**
     * Valider qu'un patient_id est accessible par l'utilisateur actuel
     * @param {string} patientId - ID du patient à valider
     * @returns {Promise<boolean>} True si accessible
     */
    async validerAccesPatient(patientId) {
        try {
            const profils = await this.getProfilsDisponibles();
            return profils.some(profil => profil.id === patientId);
        } catch (error) {
            console.error('Erreur lors de la validation d\'accès au patient:', error);
            return false;
        }
    }
};

export default sousCompteService;
