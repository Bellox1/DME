import React, { useState, useEffect } from 'react';
import PatientLayout from '../../components/layouts/PatientLayout';
import patientService from '../../services/patient/patientService';

const Activites = () => {
    const [activites, setActivites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllActivities = async (patientId = null) => {
            try {
                setLoading(true);
                const data = await patientService.getAllActivities(patientId);
                setActivites(data);
            } catch (error) {
                console.error("Erreur chargement activites", error);
            } finally {
                setLoading(false);
            }
        };

        const savedProfile = localStorage.getItem('active-patient-profile');
        const activeId = savedProfile ? JSON.parse(savedProfile).id : null;
        fetchAllActivities(activeId);

        const handleProfileChange = (event) => {
            fetchAllActivities(event.detail.id);
        };

        window.addEventListener('patientProfileChanged', handleProfileChange);
        return () => window.removeEventListener('patientProfileChanged', handleProfileChange);
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmé':
            case 'terminé':
            case 'disponible':
            case 'approuvé':
                return 'bg-green-100 text-green-600 dark:bg-green-900/20';
            case 'en attente':
            case 'en_cours':
            case 'à venir':
                return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20';
            case 'annulé':
            case 'refusé':
            case 'rejeté':
                return 'bg-red-100 text-red-600 dark:bg-red-900/20';
            default:
                return 'bg-slate-100 text-slate-600 dark:bg-slate-800';
        }
    };

    return (
        <PatientLayout>
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 transition-all duration-[800ms]">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-titles dark:text-white tracking-tight">
                        Vos <span className="text-secondary">Activités</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Historique complet de vos rendez-vous, demandes et consultations.</p>
                </div>

                <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm">
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activites.length > 0 ? (
                                activites.map((item, i) => {
                                    const statutDisplay = item.type === 'rdv' ? item.statut : (item.type === 'demande' ? item.statut : 'Consultation');
                                    return (
                                        <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="size-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm shrink-0">
                                                    <span className="material-symbols-outlined text-[24px]">
                                                        {item.type === 'rdv' ? 'event_note' : (item.type === 'demande' ? 'assignment' : 'stethoscope')}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-sm font-black text-titles dark:text-white capitalize line-clamp-1">{item.medecin}</span>
                                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                                            <span className="material-symbols-outlined text-[10px] text-slate-400">person</span>
                                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter truncate max-w-[100px]">{item.patient_nom}</span>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider line-clamp-1">{item.motif}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between md:justify-end gap-12 text-right w-full md:w-auto mt-2 md:mt-0 pl-[4.5rem] md:pl-0">
                                                <div className="flex flex-col items-start md:items-end">
                                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Date</span>
                                                    <span className="text-sm font-bold text-titles dark:text-white">{formatDate(item.date)}</span>
                                                </div>
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${getStatusColor(statutDisplay)}`}>
                                                    {statutDisplay}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-20 text-center">
                                    <div className="size-20 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6 text-slate-300">
                                        <span className="material-symbols-outlined text-4xl">history_toggle_off</span>
                                    </div>
                                    <h3 className="text-lg font-black text-titles dark:text-white mb-2">Aucune activité</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto">Votre historique d'activités est vide pour le moment.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </PatientLayout>
    );
};

export default Activites;
