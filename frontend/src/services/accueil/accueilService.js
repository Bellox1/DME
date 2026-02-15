// import api from '../api';

// const accueilService = {
//     // Liste des patients
//     async getPatients(params = {}) {
//         try {
//             const response = await api.get('/patients', { params });
//             const rawData = response.data.data || response.data;
//             return rawData.map(p => {
//                 const info = p.utilisateur || p.enfant || {};
//                 return {
//                     id: p.id,
//                     nom: info.nom || 'N/A',
//                     prenom: info.prenom || '',
//                     tel: info.tel || 'Pas de numéro',
//                     type: p.enfant_id ? 'Enfant' : 'Autonome',
//                     derniere_visite: p.date_modification || p.date_creation,
//                     whatsapp: info.whatsapp || null
//                 };
//             });
//         } catch (error) {
//             console.error("Erreur mapping patients:", error);
//             throw error;
//         }
//     },

//     // Récupérer UN patient pour le formulaire d'édition
//     async getPatientById(id) {
//         try {
//             const response = await api.get(`/patients/${id}`);
//             const p = response.data.data || response.data; // On gère le wrapper 'data' de Laravel

//             const info = p.utilisateur || p.enfant || {};

//             return {
//                 id: p.id,
//                 utilisateur_id: p.utilisateur_id,
//                 enfant_id: p.enfant_id,
//                 nom: info.nom || '',
//                 prenom: info.prenom || '',
//                 tel: info.tel || '',
//                 sexe: info.sexe || '',
//                 ville: p.ville || '',
//                 taille: p.taille || '',
//                 poids: p.poids || '',
//                 groupe_sanguin: p.groupe_sanguin || '',
//                 date_naissance: p.date_naissance || info.date_naissance || '',
//                 adresse: p.adresse || '',
//                 whatsapp: info.whatsapp || '',
//                 type: p.enfant_id ? 'Enfant' : 'Autonome'
//             };
//         } catch (error) {
//             console.error("Erreur récupération:", error);
//             throw error;
//         }
//     },

//     // Mettre à jour (Le cœur du problème)
//     async updatePatient(id, data) {
//         try {
//             // Sécurité : On ne garde que ce dont le backend a besoin
//             // Et on s'assure que le mot de passe n'est JAMAIS inclus
//             const { password: _pw, access_token: _tk, type: _t, ...payload } = data;
//             // On utilise toujours l'ID du PATIENT dans l'URL
//             // Le backend se chargera de trouver l'utilisateur lié
//             const response = await api.put(`/patients/${id}`, payload);

//             return response.data;
//         } catch (error) {
//             // On extrait le message d'erreur précis (ex: "The tel has already been taken")
//             const errorMsg = error.response?.data?.errors?.tel?.[0]
//                 || error.response?.data?.message
//                 || "Erreur lors de la mise à jour";

//             console.error("Détails erreur API:", error.response?.data);
//             throw new Error(errorMsg);
//         }
//     }
// };

// export default accueilService;






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
                    utilisateur_id: p.utilisateur_id, 
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
    },



    // PARTIE RENDEZ-VOUS 
    // Récupérer toutes les demandes (Flux de droite et liste)
    async getAllDemandes() {
        try {
            // Ton contrôleur Laravel utilise l'URL '/rdvs'
            const response = await api.get('/rdvs');
            return response.data.data || response.data || [];
        } catch (error) {
            console.error("Erreur récupération demandes:", error);
            return [];
        }
    },

    // Changer le statut d'un RDV (QueueController@updateStatus)
    async updateRdvStatus(id, newStatus) {
        try {
            // Respecte strictement l'enum: programmé, passé, annulé
            const response = await api.patch(`/rdvs/${id}/status`, {
                statut: newStatus
            });
            return response.data;
        } catch (error) {
            console.error("Erreur statut:", error.response?.data);
            throw error;
        }
    },

    // Créer un nouveau RDV (RdvController@store)
    async createRdv(payload) {
        try {
            const response = await api.post('/rdvs', payload);
            return response.data;
        } catch (error) {
            console.error("Erreur création RDV:", error.response?.data);
            throw error;
        }
    },

    // Valider une demande pour qu'elle apparaisse dans le planning
    async validerDemande(id) {
        try {
            // On passe le statut à 'programmé' (seul statut valide pour un RDV actif)
            const response = await api.patch(`/rdvs/${id}/status`, {
                statut: 'programmé'
            });
            return response.data;
        } catch (error) {
            console.error("Erreur validation RDV:", error);
            throw error;
        }
    },

    // Récupérer les RDV pour le planning (QueueController)
    async getPlanning(date = null) {
        try {
            const params = date ? { date } : {};
            const response = await api.get('/rdvs/planning', { params });
            return response.data.data || [];
        } catch (error) {
            console.error("Erreur planning:", error);
            return [];
        }
    },


    async getAllMedecins() {
        try {
            const response = await api.get('/medecins');
            // Laravel renvoie directement le tableau ici
            const rawData = response.data;

            return rawData.map(m => ({
                id: m.id,
                nom: m.nom,
                prenom: m.prenom,
                // On met 'Médecin' par défaut car la colonne spécialité n'existe pas en base
                specialite: m.ville || 'Généraliste'
            }));
        } catch (error) {
            console.error("Erreur lors de la récupération des médecins", error);
            return [];
        }
    },



    // --- STATISTIQUES (La partie que tu gères actuellement) ---
    async getGlobalStats() {
        try {
            const response = await api.get('/stats/globales');
            return response.data;
        } catch (error) {
            console.error("Erreur récupération stats:", error);
            throw error;
        }
    },


    async resendActivation(userId) {
        try {
            // On envoie un objet avec la clé 'utilisateur_id'
            const response = await api.post('/auth/resend-activation', {
                utilisateur_id: userId
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Erreur lors du renvoi";
        }
    }


};

export default accueilService;