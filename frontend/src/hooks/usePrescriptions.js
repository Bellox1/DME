import { useState, useEffect } from 'react';
import prescriptionService from '../services/patient/prescriptionService';

export const usePrescriptions = () => {
    const [ordonnances, setOrdonnances] = useState([]);
    const [ordonnancesGrouped, setOrdonnancesGrouped] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);
    const [activeProfile, setActiveProfile] = useState(() => {
        const saved = localStorage.getItem('active-patient-profile');
        return saved ? JSON.parse(saved) : { id: null, nom_affichage: 'Vue d\'ensemble' };
    });

    // Charger toutes les ordonnances
    const loadOrdonnances = async (profileId = activeProfile?.id) => {
        setLoading(true);
        setError(null);

        try {
            const response = await prescriptionService.getMesOrdonnances(profileId);

            if (response.success && response.data) {
                const formattedOrdonnances = prescriptionService.formatOrdonnancesList(response.data);
                const grouped = prescriptionService.groupOrdonnancesByNumero(response.data);

                setOrdonnances(formattedOrdonnances);
                setOrdonnancesGrouped(grouped);
            } else {
                setOrdonnances([]);
                setOrdonnancesGrouped([]);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors du chargement des ordonnances');
            setOrdonnances([]);
            setOrdonnancesGrouped([]);
        } finally {
            setLoading(false);
        }
    };

    // Charger les statistiques
    const loadStats = async (profileId = activeProfile?.id) => {
        try {
            const response = await prescriptionService.getOrdonnancesStats(profileId);
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            console.error('Erreur lors du chargement des statistiques:', err);
        }
    };

    // Télécharger une ordonnance en PDF
    const downloadPdf = async (ordonnanceId) => {
        try {
            setLoading(true);
            const result = await prescriptionService.downloadOrdonnancePdf(ordonnanceId);
            return result;
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors du téléchargement du PDF');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Charger les ordonnances d'une consultation spécifique
    const loadOrdonnancesByConsultation = async (consultationId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await prescriptionService.getOrdonnancesByConsultation(consultationId);

            if (response.success && response.data) {
                const formattedOrdonnances = prescriptionService.formatOrdonnancesList(response.data);
                return formattedOrdonnances;
            }
            return [];
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors du chargement des ordonnances de la consultation');
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Filtrer les ordonnances par statut
    const filterByStatus = (status) => {
        if (!status) return ordonnances;
        return prescriptionService.filterOrdonnancesByStatus(ordonnances, status);
    };

    // Trier les ordonnances
    const sortOrdonnances = (order = 'desc') => {
        return prescriptionService.sortOrdonnancesByDate(ordonnances, order);
    };

    // Rafraîchir les données
    const refresh = () => {
        loadOrdonnances();
        loadStats();
    };

    // Effacer l'erreur
    const clearError = () => {
        setError(null);
    };

    // Charger les données au montage du composant
    useEffect(() => {
        loadOrdonnances();
        loadStats();

        const handleProfileChange = (e) => {
            const newProfile = e.detail;
            setActiveProfile(newProfile);
            loadOrdonnances(newProfile.id);
            loadStats(newProfile.id);
        };

        window.addEventListener('patientProfileChanged', handleProfileChange);
        return () => window.removeEventListener('patientProfileChanged', handleProfileChange);
    }, []);

    return {
        // Données
        ordonnances,
        ordonnancesGrouped,
        stats,
        loading,
        error,
        activeProfile,

        // Méthodes
        loadOrdonnances,
        loadStats,
        loadOrdonnancesByConsultation,
        downloadPdf,
        filterByStatus,
        sortOrdonnances,
        refresh,
        clearError,

        // Utilitaires
        hasOrdonnances: ordonnances.length > 0,
        hasGroupedOrdonnances: ordonnancesGrouped.length > 0,
        totalOrdonnances: ordonnances.length,
        activeOrdonnances: filterByStatus('ACTIVE').length,
        expiredOrdonnances: filterByStatus('EXPIREE').length,
        cancelledOrdonnances: filterByStatus('ANNULEE').length
    };
};

export default usePrescriptions;
