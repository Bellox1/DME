import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientLayout from '../../components/layouts/PatientLayout';
import patientService from '../../services/patient/patientService';

const Dossier = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [profils, setProfils] = useState([]);
    const [selectedProfilId, setSelectedProfilId] = useState(null);
    const [dossier, setDossier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [historyFilter, setHistoryFilter] = useState('');
    const [showFilter, setShowFilter] = useState(false);

    // 1. Charger la liste des profils accessibles
    useEffect(() => {
        const fetchProfils = async () => {
            try {
                const data = await patientService.getProfils();
                setProfils(data);

                // Priorité de sélection :
                // 1. URL Parameter (:patientId)
                // 2. localStorage (active-patient-profile)
                // 3. Premier profil de la liste

                if (patientId) {
                    setSelectedProfilId(parseInt(patientId));
                } else {
                    const saved = localStorage.getItem('active-patient-profile');
                    if (saved) {
                        const profile = JSON.parse(saved);
                        if (profile.id) {
                            setSelectedProfilId(profile.id);
                        } else if (data.length > 0) {
                            // Si c'est "Global", on prend le premier profil réel (Titulaire)
                            setSelectedProfilId(data[0].id);
                        }
                    } else if (data.length > 0) {
                        setSelectedProfilId(data[0].id);
                    }
                }
            } catch (error) {
                console.error("Erreur chargement profils", error);
            }
        };
        fetchProfils();

        // Écouter les changements de profil globaux
        const handleProfileChange = (event) => {
            if (event.detail.id) {
                setSelectedProfilId(event.detail.id);
                // Optionnel : Mettre à jour l'URL sans recharger
                navigate(`/patient/dossier/${event.detail.id}`, { replace: true });
            }
        };

        window.addEventListener('patientProfileChanged', handleProfileChange);
        return () => window.removeEventListener('patientProfileChanged', handleProfileChange);
    }, [patientId, navigate]);

    // 2. Charger le détail du dossier quand l'ID change
    useEffect(() => {
        if (!selectedProfilId) return;

        const fetchDossier = async () => {
            setLoading(true);
            try {
                const data = await patientService.getDossier(selectedProfilId);
                setDossier(data);
            } catch (error) {
                console.error("Erreur chargement dossier", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDossier();
    }, [selectedProfilId]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (loading && !dossier) {
        return (
            <PatientLayout>
                <div className="flex h-full items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </PatientLayout>
        );
    }

    // Données par défaut si vide (évite plantage)
    // Données par défaut si vide (évite plantage)
    const { constantes, resume_medical, consultations, infos_patient } = dossier || {};

    // Filtrage Historique
    const filteredConsultations = (consultations || []).filter(c => {
        if (!historyFilter) return true;
        const search = historyFilter.toLowerCase();
        const motif = (c.motif || '').toLowerCase();
        const medecin = c.medecin ? `${c.medecin.nom} ${c.medecin.prenom}`.toLowerCase() : '';
        return motif.includes(search) || medecin.includes(search);
    });

    const hasConsultations = filteredConsultations.length > 0;

    // Calcul IMC Affichage
    let imcValue = constantes?.bmi;
    let imcLabel = 'N/A';
    if (imcValue) {
        if (imcValue < 18.5) imcLabel = '(Maigreur)';
        else if (imcValue < 25) imcLabel = '(Normal)';
        else if (imcValue < 30) imcLabel = '(Surpoids)';
        else imcLabel = '(Obésité)';
    }

    return (
        <PatientLayout>
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 transition-all duration-[800ms]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-black text-titles dark:text-white tracking-tight uppercase italic">
                            Dossier <span className="text-secondary">Médical</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">L'ensemble des données de santé.</p>
                    </div>

                </div>

                {!dossier ? (
                    <div className="p-8 text-center text-slate-500">Aucune donnée disponible.</div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Infos Vitales */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm">
                                <h3 className="text-lg font-black text-titles dark:text-white mb-6">Informations Vitales ({infos_patient?.nom_complet})</h3>
                                <div className="space-y-6">
                                    {[
                                        { label: 'Groupe Sanguin', value: constantes?.groupe_sanguin || '--', icon: 'bloodtype', color: 'text-red-500' },
                                        { label: 'Taille', value: constantes?.taille ? `${constantes.taille} cm` : '--', icon: 'height', color: 'text-blue-500' },
                                        { label: 'Poids', value: constantes?.poids ? `${constantes.poids} kg` : '--', icon: 'weight', color: 'text-green-500' },
                                        { label: 'IMC', value: imcValue ? `${imcValue} ${imcLabel}` : '--', icon: 'speed', color: 'text-orange-500' },
                                    ].map((info, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-transparent">
                                            <div className={`size-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center ${info.color} shadow-sm border border-slate-100 dark:border-slate-700`}>
                                                <span className="material-symbols-outlined text-[20px]">{info.icon}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-display">{info.label}</span>
                                                <span className="text-sm font-black text-titles dark:text-white">{info.value}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm">
                                <h3 className="text-lg font-black text-titles dark:text-white mb-6">Antécédents & Allergies</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Antécédents</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {resume_medical?.antecedents && resume_medical.antecedents.length > 0 ? (
                                                resume_medical.antecedents.map((item, i) => (
                                                    <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium">
                                                        {item}
                                                    </span>
                                                ))
                                            ) : <span className="text-xs text-slate-400 italic">Aucun antécédent noté.</span>}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Allergies</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {resume_medical?.allergies && resume_medical.allergies.length > 0 ? (
                                                resume_medical.allergies.map((item, i) => (
                                                    <span key={i} className="px-3 py-1 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-lg text-xs font-medium border border-red-100 dark:border-red-900/20">
                                                        {item}
                                                    </span>
                                                ))
                                            ) : <span className="text-xs text-slate-400 italic">Aucune allergie connue.</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Historique Médical Facette Animée */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm">
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                                    <h3 className="text-xl font-black text-titles dark:text-white">Historique des Consultations</h3>
                                    <div className="flex items-center gap-2 transition-all ml-auto">
                                        {showFilter && (
                                            <input
                                                type="text"
                                                value={historyFilter}
                                                onChange={(e) => setHistoryFilter(e.target.value)}
                                                placeholder="Rechercher..."
                                                className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-base sm:text-xs font-bold text-titles dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 w-32 sm:w-48 md:w-64 animate-in fade-in slide-in-from-right-4 duration-300"
                                                autoFocus
                                            />
                                        )}
                                        <button
                                            onClick={() => setShowFilter(!showFilter)}
                                            className={`size-10 rounded-xl flex items-center justify-center transition-all border shrink-0 ${showFilter || historyFilter
                                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                                                : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border-slate-100 dark:border-slate-800'}`}
                                            title="Filtrer l'historique"
                                        >
                                            <span className="material-symbols-outlined">{showFilter ? 'close' : 'filter_list'}</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-12 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-[#2d363f]">
                                    {hasConsultations ? (
                                        filteredConsultations.map((consult, i) => (
                                            <div key={i} className="relative pl-14 group">
                                                <div className="absolute left-4 top-0 size-4 bg-white dark:bg-[#1c2229] border-4 border-primary rounded-full z-10" />
                                                <div className="flex flex-col gap-2 p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900/40 border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-800 transition-all">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="text-[13px] font-black text-titles dark:text-white">Consultation ({consult.motif})</h4>
                                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{formatDate(consult.dateH_visite)}</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                                                        {consult.medecin ? `Dr. ${consult.medecin.nom}` : 'Médecin inconnu'}
                                                    </p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
                                                        {consult.diagnostic || consult.observations_medecin || "Pas de détails."}
                                                    </p>
                                                    {consult.prescriptions && consult.prescriptions.length > 0 && (
                                                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2 block">Traitements prescrits</span>
                                                            <div className="flex flex-wrap gap-2">
                                                                {consult.prescriptions.map((p, k) => (
                                                                    <div key={k} className="flex flex-col bg-white dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
                                                                        <span className="text-xs font-bold text-titles dark:text-white">{p.nom_medicament}</span>
                                                                        <span className="text-[10px] text-slate-400">{p.dosage}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="pl-14 text-slate-500 text-sm">Aucun historique de consultation disponible.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PatientLayout>
    );
};

export default Dossier;
