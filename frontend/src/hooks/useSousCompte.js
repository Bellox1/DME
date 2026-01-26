import { useState, useEffect, useCallback } from 'react';
import sousCompteService from '../services/patient/sousCompteService';

/**
 * Hook pour gérer le système de sous-compte
 * @returns {Object} État et fonctions du système de sous-compte
 */
const useSousCompte = () => {
    const [profils, setProfils] = useState([]);
    const [profilActuel, setProfilActuel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialiser le service et charger les profils
    useEffect(() => {
        const initialiser = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Initialiser le service
                const profilsDisponibles = await sousCompteService.initialiser();
                setProfils(profilsDisponibles);
                
                // Récupérer le profil actuel
                const actuel = sousCompteService.getProfilActuel();
                setProfilActuel(actuel);
            } catch (err) {
                console.error('Erreur lors de l\'initialisation des sous-comptes:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        initialiser();
    }, []);

    // Écouter les changements de profil
    useEffect(() => {
        const handleChangementProfil = (event) => {
            setProfilActuel(event.detail.profil);
        };

        window.addEventListener('changementProfil', handleChangementProfil);
        return () => {
            window.removeEventListener('changementProfil', handleChangementProfil);
        };
    }, []);

    /**
     * Changer de profil
     * @param {Object} nouveauProfil - Nouveau profil à sélectionner
     */
    const changerProfil = useCallback(async (nouveauProfil) => {
        try {
            setError(null);
            const succes = sousCompteService.changerProfil(nouveauProfil);
            if (succes) {
                setProfilActuel(nouveauProfil);
            }
        } catch (err) {
            console.error('Erreur lors du changement de profil:', err);
            setError(err.message);
        }
    }, []);

    /**
     * Réinitialiser au profil titulaire
     */
    const resetToTitulaire = useCallback(() => {
        try {
            setError(null);
            const succes = sousCompteService.resetToTitulaire();
            if (succes) {
                const titulaire = profils.find(p => p.type === 'Titulaire');
                setProfilActuel(titulaire || null);
            }
        } catch (err) {
            console.error('Erreur lors de la réinitialisation:', err);
            setError(err.message);
        }
    }, [profils]);

    /**
     * Obtenir le patient_id pour les requêtes API
     * @param {string|null} patientIdForcé - Patient_id spécifique
     * @returns {string|null}
     */
    const getPatientId = useCallback((patientIdForcé = null) => {
        return sousCompteService.getPatientId(patientIdForcé);
    }, []);

    /**
     * Obtenir le nom d'affichage du profil actuel
     * @returns {string}
     */
    const getNomProfil = useCallback(() => {
        return sousCompteService.getNomProfilActuel();
    }, []);

    /**
     * Vérifier si le profil actuel est le titulaire
     * @returns {boolean}
     */
    const isTitulaire = useCallback(() => {
        return sousCompteService.isTitulaire();
    }, []);

    /**
     * Vérifier si le profil actuel est un enfant
     * @returns {boolean}
     */
    const isEnfant = useCallback(() => {
        return sousCompteService.isEnfant();
    }, []);

    /**
     * Filtrer des données par profil actuel
     * @param {Array} données - Données à filtrer
     * @param {string} champId - Champ contenant l'ID du patient
     * @returns {Array}
     */
    const filterByProfil = useCallback((données, champId = 'patient_id') => {
        return sousCompteService.filterByProfilActuel(données, champId);
    }, []);

    /**
     * Préparer les paramètres avec patient_id
     * @param {Object} params - Paramètres existants
     * @param {string|null} patientIdForcé - Patient_id spécifique
     * @returns {Object}
     */
    const preparerParams = useCallback((params = {}, patientIdForcé = null) => {
        return sousCompteService.preparerParamsAvecPatientId(params, patientIdForcé);
    }, []);

    /**
     * Obtenir les informations formatées du profil actuel
     * @returns {Object|null}
     */
    const getInfosProfil = useCallback(() => {
        if (!profilActuel) return null;
        return sousCompteService.getInfosProfil(profilActuel);
    }, [profilActuel]);

    /**
     * Rafraîchir les profils depuis le backend
     */
    const rafraichirProfils = useCallback(async () => {
        try {
            setError(null);
            const profilsMisAJour = await sousCompteService.getProfilsDisponibles();
            setProfils(profilsMisAJour);
            
            // Vérifier que le profil actuel est toujours valide
            if (profilActuel) {
                const profilExiste = profilsMisAJour.find(p => p.id === profilActuel.id);
                if (!profilExiste) {
                    // Le profil n'existe plus, réinitialiser
                    resetToTitulaire();
                }
            }
        } catch (err) {
            console.error('Erreur lors du rafraîchissement des profils:', err);
            setError(err.message);
        }
    }, [profilActuel, resetToTitulaire]);

    return {
        // État
        profils,
        profilActuel,
        loading,
        error,
        
        // Actions
        changerProfil,
        resetToTitulaire,
        rafraichirProfils,
        
        // Utilitaires
        getPatientId,
        getNomProfil,
        isTitulaire,
        isEnfant,
        filterByProfil,
        preparerParams,
        getInfosProfil,
        
        // Propriétés dérivées
        aPlusieursProfils: profils.length > 1,
        nomProfilActuel: getNomProfil(),
        estTitulaire: isTitulaire(),
        estEnfant: isEnfant()
    };
};

export default useSousCompte;
