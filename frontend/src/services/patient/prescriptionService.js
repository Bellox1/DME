import api from '../api';

const prescriptionService = {
    // --- GESTION DES ORDONNANCES ---

    // Récupérer toutes les ordonnances du patient
    async getMesOrdonnances() {
        try {
            const response = await api.get('/ordonnances');
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
    async getOrdonnancesStats() {
        try {
            const response = await api.get('/ordonnances/stats');
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
    }
};

export default prescriptionService;
