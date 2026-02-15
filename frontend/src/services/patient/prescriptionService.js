import api from '../api';
import sousCompteService from './sousCompteService';

const prescriptionService = {
    // --- GESTION DES ORDONNANCES ---

    // Récupérer toutes les ordonnances du patient
    async getMesOrdonnances(patientId = null) {
        try {
            const params = sousCompteService.preparerParamsAvecPatientId({}, patientId);
            const url = sousCompteService.construireUrlAvecPatientId('/ordonnances', params);
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des ordonnances:', error);
            throw error;
        }
    },

    // Récupérer une ordonnance spécifique par son ID
    async getOrdonnanceById(id) {
        try {
            const response = await api.get(`/ordonnances/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de l'ordonnance ${id}:`, error);
            throw error;
        }
    },

    // Récupérer les ordonnances d'une consultation spécifique
    async getOrdonnancesByConsultation(consultationId) {
        try {
            const response = await api.get(`/consultations/${consultationId}/ordonnances`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération des ordonnances de la consultation ${consultationId}:`, error);
            throw error;
        }
    },

    // Télécharger une ordonnance en PDF
    async downloadOrdonnancePdf(id) {
        try {
            const response = await api.get(`/ordonnances/${id}/download`, {
                responseType: 'blob'
            });

            // Créer un URL temporaire pour le téléchargement
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Extraire le nom du fichier depuis les headers ou utiliser un nom par défaut
            const contentDisposition = response.headers['content-disposition'];
            let filename = `ordonnance_${id}.pdf`;

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return { success: true, filename };
        } catch (error) {
            console.error(`Erreur lors du téléchargement du PDF de l'ordonnance ${id}:`, error);
            throw error;
        }
    },

    // Obtenir les statistiques des ordonnances du patient
    async getOrdonnancesStats(patientId = null) {
        try {
            const params = sousCompteService.preparerParamsAvecPatientId({}, patientId);
            const url = sousCompteService.construireUrlAvecPatientId('/ordonnances/stats', params);
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques des ordonnances:', error);
            throw error;
        }
    },

    // --- UTILITAIRES ---

    // Formater les données d'une ordonnance pour l'affichage
    formatOrdonnance(prescription) {
        return {
            id: prescription.id,
            numero: prescription.numero_ordonnance || `ORD-${prescription.id}`,
            medecin: prescription.medecin ?
                `Dr. ${prescription.medecin.nom} ${prescription.medecin.prenom}` :
                'Médecin non spécifié',
            medicament: prescription.nom_medicament,
            dosage: prescription.dosage,
            instructions: prescription.instructions,
            statut: prescription.statut,
            date: new Date(prescription.date_creation).toLocaleDateString('fr-FR'),
            dateComplete: new Date(prescription.date_creation).toLocaleString('fr-FR'),
            fichierPdf: prescription.fichier_pdf,
            consultation: prescription.consultation
        };
    },

    // Formater une liste d'ordonnances
    formatOrdonnancesList(prescriptions) {
        return prescriptions.map(prescription => this.formatOrdonnance(prescription));
    },

    // Grouper les ordonnances par numéro d'ordonnance
    groupOrdonnancesByNumero(prescriptions) {
        const grouped = {};

        prescriptions.forEach(prescription => {
            const numero = prescription.numero_ordonnance || `ORD-${prescription.id}`;

            if (!grouped[numero]) {
                grouped[numero] = {
                    numero,
                    date: prescription.date_creation,
                    medecin: prescription.medecin,
                    medicaments: [],
                    statut: prescription.statut,
                    fichiersPdf: []
                };
            }

            grouped[numero].medicaments.push({
                id: prescription.id,
                nom: prescription.nom_medicament,
                dosage: prescription.dosage,
                instructions: prescription.instructions
            });

            if (prescription.fichier_pdf && !grouped[numero].fichiersPdf.includes(prescription.fichier_pdf)) {
                grouped[numero].fichiersPdf.push(prescription.fichier_pdf);
            }
        });

        return Object.values(grouped);
    },

    // Filtrer les ordonnances par statut
    filterOrdonnancesByStatus(prescriptions, status) {
        if (!status) return prescriptions;
        return prescriptions.filter(prescription => prescription.statut === status);
    },

    // Trier les ordonnances par date
    sortOrdonnancesByDate(prescriptions, order = 'desc') {
        return [...prescriptions].sort((a, b) => {
            const dateA = new Date(a.date_creation);
            const dateB = new Date(b.date_creation);
            return order === 'desc' ? dateB - dateA : dateA - dateB;
        });
    },

    // --- UTILITAIRES POUR LES SOUS-COMPTES ---

    /**
     * Obtenir les ordonnances du profil actuel
     * @param {string|null} patientIdForcé - Patient_id spécifique
     * @returns {Promise<Array>} Ordonnances filtrées
     */
    async getOrdonnancesParProfil(patientIdForcé = null) {
        const patientId = sousCompteService.getPatientId(patientIdForcé);
        return this.getMesOrdonnances(patientId);
    },

    /**
     * Obtenir les statistiques du profil actuel
     * @param {string|null} patientIdForcé - Patient_id spécifique
     * @returns {Promise<Object>} Statistiques filtrées
     */
    async getStatsParProfil(patientIdForcé = null) {
        const patientId = sousCompteService.getPatientId(patientIdForcé);
        return this.getOrdonnancesStats(patientId);
    },

    /**
     * Obtenir les statistiques globales pour tous les profils
     * @returns {Promise<Object>} Statistiques globales
     */
    async getStatsGlobales() {
        // Forcer l'utilisation de 'all' pour obtenir toutes les données
        return this.getOrdonnancesStats('all');
    },

    /**
     * Télécharger une ordonnance avec validation d'accès
     * @param {string} id - ID de l'ordonnance
     * @param {string|null} patientIdForcé - Patient_id spécifique
     * @returns {Promise<Object>} Résultat du téléchargement
     */
    async downloadOrdonnanceAvecValidation(id, patientIdForcé = null) {
        try {
            // Valider l'accès au profil si nécessaire
            if (patientIdForcé) {
                const aAcces = await sousCompteService.validerAccesPatient(patientIdForcé);
                if (!aAcces) {
                    throw new Error('Accès non autorisé à cette ordonnance');
                }
            }
            
            return this.downloadOrdonnancePdf(id);
        } catch (error) {
            console.error(`Erreur lors du téléchargement de l'ordonnance ${id}:`, error);
            throw error;
        }
    },

    /**
     * Filtrer les ordonnances par profil actuel
     * @param {Array} ordonnances - Liste des ordonnances
     * @param {string} champPatientId - Champ contenant l'ID du patient
     * @returns {Array} Ordonnances filtrées
     */
    filterOrdonnancesByProfil(ordonnances, champPatientId = 'patient_id') {
        return sousCompteService.filterByProfilActuel(ordonnances, champPatientId);
    },

    /**
     * Obtenir les ordonnances groupées par profil
     * @param {string|null} patientIdForcé - Patient_id spécifique
     * @returns {Promise<Object>} Ordonnances groupées
     */
    async getOrdonnancesGroupesParProfil(patientIdForcé = null) {
        try {
            const ordonnances = await this.getOrdonnancesParProfil(patientIdForcé);
            return this.groupOrdonnancesByNumero(ordonnances);
        } catch (error) {
            console.error('Erreur lors du groupement des ordonnances:', error);
            throw error;
        }
    },

    /**
     * Créer un rapport d'ordonnances pour le profil actuel
     * @param {Object} options - Options du rapport
     * @returns {Promise<Object>} Rapport généré
     */
    async creerRapportOrdonnances(options = {}) {
        try {
            const {
                inclureInactives = false,
                periode = null,
                format = 'complet'
            } = options;

            let ordonnances = await this.getOrdonnancesParProfil();
            
            // Filtrer par statut
            if (!inclureInactives) {
                ordonnances = this.filterOrdonnancesByStatus(ordonnances, 'ACTIVE');
            }
            
            // Filtrer par période
            if (periode) {
                const maintenant = new Date();
                const dateLimite = new Date();
                
                switch (periode) {
                    case '7jours':
                        dateLimite.setDate(maintenant.getDate() - 7);
                        break;
                    case '30jours':
                        dateLimite.setDate(maintenant.getDate() - 30);
                        break;
                    case '3mois':
                        dateLimite.setMonth(maintenant.getMonth() - 3);
                        break;
                    default:
                        break;
                }
                
                ordonnances = ordonnances.filter(ord => 
                    new Date(ord.date_creation) >= dateLimite
                );
            }
            
            // Formatter selon le format demandé
            switch (format) {
                case 'simple':
                    return {
                        total: ordonnances.length,
                        ordonnances: ordonnances.map(ord => ({
                            id: ord.id,
                            medicament: ord.nom_medicament,
                            dosage: ord.dosage,
                            date: ord.date
                        }))
                    };
                case 'statistiques': {
                    const stats = await this.getStatsParProfil();
                    return {
                        ...stats,
                        periode,
                        ordonnancesRecentes: ordonnances.slice(0, 5)
                    };
                }
                default:
                    return {
                        ...await this.getStatsParProfil(),
                        ordonnances: this.formatOrdonnancesList(ordonnances),
                        groupees: this.groupOrdonnancesByNumero(ordonnances)
                    };
            }
        } catch (error) {
            console.error('Erreur lors de la création du rapport:', error);
            throw error;
        }
    }
};

export default prescriptionService;
