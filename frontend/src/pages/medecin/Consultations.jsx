import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import DoctorLayout from '../../components/layouts/DoctorLayout';
import medicalService from '../../services/medicalService';

const ConsultationsMedecin = () => {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const patientIdFilter = queryParams.get('patient');
    const [selectedPatientId, setSelectedPatientId] = useState(patientIdFilter || '');

    useEffect(() => {
        if (patientIdFilter && queryParams.get('new') === 'true') {
            setShowNewModal(true);
            setSelectedPatientId(patientIdFilter);
        }
    }, [patientIdFilter]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                if (patientIdFilter) {
                    // Charger l'historique complet du patient
                    const historyResponse = await medicalService.getPatientHistory(patientIdFilter);
                    const consultationsData = historyResponse.data?.consultations || [];
                    setConsultations(consultationsData.sort((a, b) => new Date(b.dateH_visite) - new Date(a.dateH_visite)));
                } else {
                    // Charger toutes les consultations du médecin en une seule requête
                    const response = await medicalService.getAllConsultations();
                    const consultationsData = response.data || [];
                    setConsultations(consultationsData.sort((a, b) => new Date(b.dateH_visite) - new Date(a.dateH_visite)));
                }
            } catch (err) {
                console.error('Erreur chargement consultations:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [patientIdFilter]);

    const [showNewModal, setShowNewModal] = useState(false);
    const [newConsultation, setNewConsultation] = useState({
        motif: '',
        diagnostic: '',
        poids: '',
        tension: '',
        temperature: ''
    });

    const handleCreateConsultation = async (e) => {
        e.preventDefault();
        try {
            await consultationService.createConsultation({
                ...newConsultation,
                patient_id: selectedPatientId,
                medecin_id: 1 // À remplacer par l'ID réel du médecin connecté
            });
            setShowNewModal(false);
            // Recharger les données
            window.location.reload();
        } catch (err) {
            console.error('Erreur création consultation:', err);
            alert('Erreur lors de l\'enregistrement de la consultation');
        }
    };

    const getPatientName = (patientId) => {
        return `Patient #${patientId}`;
    };

    return (
        <DoctorLayout>
            <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-8 md:gap-12 transition-all duration-1000 animate-in fade-in slide-in-from-bottom-4">

                {/* Modal Nouvelle Consultation */}
                {showNewModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-[#1c2229] w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                            <div className="p-8 md:p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-black text-titles dark:text-white uppercase italic tracking-tighter">Nouvelle Consultation</h3>
                                    {!patientIdFilter ? (
                                        <p className="text-sm text-slate-400 font-medium italic">Sélectionnez un patient pour cette séance.</p>
                                    ) : (
                                        <p className="text-sm text-slate-400 font-medium italic">Enregistrement clinique pour : {getPatientName(patientIdFilter)}</p>
                                    )}
                                </div>
                                <button onClick={() => setShowNewModal(false)} className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center hover:text-rose-500 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <form onSubmit={handleCreateConsultation} className="p-8 md:p-10 space-y-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Poids (kg)</label>
                                        <input type="text" value={newConsultation.poids} onChange={e => setNewConsultation({ ...newConsultation, poids: e.target.value })} className="w-full h-14 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 text-sm font-bold text-titles dark:text-white outline-none ring-2 ring-transparent focus:ring-primary/20 transition-all" placeholder="75" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Tension</label>
                                        <input type="text" value={newConsultation.tension} onChange={e => setNewConsultation({ ...newConsultation, tension: e.target.value })} className="w-full h-14 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 text-sm font-bold text-titles dark:text-white outline-none ring-2 ring-transparent focus:ring-primary/20 transition-all" placeholder="12/8" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Temp (°C)</label>
                                        <input type="text" value={newConsultation.temperature} onChange={e => setNewConsultation({ ...newConsultation, temperature: e.target.value })} className="w-full h-14 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 text-sm font-bold text-titles dark:text-white outline-none ring-2 ring-transparent focus:ring-primary/20 transition-all" placeholder="37.5" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Motif de consultation</label>
                                    <textarea value={newConsultation.motif} onChange={e => setNewConsultation({ ...newConsultation, motif: e.target.value })} className="w-full h-32 bg-slate-50 dark:bg-slate-900 border-none rounded-[2rem] p-6 text-sm font-bold text-titles dark:text-white outline-none ring-2 ring-transparent focus:ring-primary/20 transition-all resize-none" placeholder="Décrivez les symptômes..." required></textarea>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Diagnostic clinique</label>
                                    <textarea value={newConsultation.diagnostic} onChange={e => setNewConsultation({ ...newConsultation, diagnostic: e.target.value })} className="w-full h-32 bg-slate-50 dark:bg-slate-900 border-none rounded-[2rem] p-6 text-sm font-bold text-titles dark:text-white outline-none ring-2 ring-transparent focus:ring-primary/20 transition-all resize-none" placeholder="Votre conclusion médicale..." required></textarea>
                                </div>
                                <button type="submit" className="w-full h-16 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                                    Enregistrer la consultation
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-primary/10 text-primary rounded-xl material-symbols-outlined text-[20px]">history</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Archives Médicales</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-titles dark:text-white tracking-tighter leading-none italic uppercase">
                            Historique des <span className="text-primary italic">Consultations</span>
                        </h1>
                        <p className="text-base text-slate-500 dark:text-slate-400 font-medium italic">Accédez à l'intégralité des dossiers et comptes rendus cliniques.</p>
                    </div>
                    <button
                        onClick={() => {
                            setShowNewModal(true);
                            if (!patientIdFilter) setSelectedPatientId('');
                        }}
                        className="w-full md:w-auto h-14 px-10 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        Nouvelle Consultation
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <div className="relative">
                            <div className="size-16 rounded-full border-4 border-primary/10 border-t-primary animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-[24px] animate-pulse">stethoscope</span>
                            </div>
                        </div>
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] italic">Synchronisation des dossiers...</p>
                    </div>
                ) : consultations.length === 0 ? (
                    <div className="text-center py-32 bg-white dark:bg-[#1c2229] rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center gap-6">
                        <div className="size-24 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-200">
                            <span className="material-symbols-outlined text-6xl">folder_off</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-xl font-black text-titles dark:text-white uppercase italic tracking-tight">Aucune consultation enregistrée</p>
                            <p className="text-sm text-slate-400 font-medium italic">Commencez par appeler un patient de la file d'attente.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:gap-8">
                        {consultations.map((c, i) => (
                            <div key={i} className="group relative bg-white dark:bg-[#1c2229] border border-slate-100 dark:border-[#2d363f] rounded-[3rem] p-6 md:p-10 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-700 flex flex-col md:flex-row gap-8 items-start md:items-center">

                                {/* Date / Status Column */}
                                <div className="flex flex-col items-center justify-center min-w-[120px] p-6 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">{new Date(c.dateH_visite).toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
                                    <span className="text-3xl font-black italic tracking-tighter tabular-nums mb-1">{new Date(c.dateH_visite).getDate()}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{new Date(c.dateH_visite).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                                </div>

                                {/* Main Info */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <h4 className="text-xl md:text-2xl font-black text-titles dark:text-white uppercase tracking-tighter italic flex items-center gap-3">
                                            {c.patient?.nom_complet || getPatientName(c.patient_id)}
                                            <span className="size-1.5 rounded-full bg-primary/30"></span>
                                            <span className="text-xs font-bold text-slate-400 tracking-normal non-italic">ID #{c.patient_id}</span>
                                        </h4>
                                        <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-[9px] font-black uppercase tracking-widest w-fit border border-indigo-100 dark:border-indigo-500/20">
                                            Consultation Médicale
                                        </span>
                                    </div>

                                    <div className="relative pl-6 py-2 border-l-4 border-slate-100 dark:border-slate-800 group-hover:border-primary/20 transition-all">
                                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-2">Diagnostic & Observations</span>
                                        <p className="text-sm md:text-base font-bold text-titles dark:text-white italic leading-relaxed opacity-80 group-hover:opacity-100">
                                            "{c.diagnostic || c.motif || 'Compte rendu en cours de finalisation par le médecin...'}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6 text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">schedule</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest italic">{new Date(c.dateH_visite).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">medical_information</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest italic">Dr. {c.medecin?.nom || 'Intervenant'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Column */}
                                <div className="flex md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                                    <Link
                                        to={`/medecin/consultations/${c.id}`}
                                        className="flex-1 md:size-14 rounded-2xl bg-primary text-white flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-xl shadow-primary/20 group/btn"
                                        title="Voir les détails"
                                    >
                                        <span className="material-symbols-outlined text-[24px]">visibility</span>
                                    </Link>
                                    <button
                                        onClick={async () => {
                                            try {
                                                const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
                                                const response = await fetch(`http://localhost:8000/api/consultations/${c.id}/pdf`, {
                                                    headers: {
                                                        'Authorization': `Bearer ${token}`,
                                                        'Accept': 'application/pdf'
                                                    }
                                                });

                                                if (response.ok) {
                                                    const blob = await response.blob();
                                                    const url = window.URL.createObjectURL(blob);
                                                    const a = document.createElement('a');
                                                    a.href = url;
                                                    a.download = `ordonnance_${c.id}.pdf`;
                                                    document.body.appendChild(a);
                                                    a.click();
                                                    window.URL.revokeObjectURL(url);
                                                    document.body.removeChild(a);
                                                } else {
                                                    alert('Erreur lors du téléchargement du PDF');
                                                }
                                            } catch (error) {
                                                console.error('Erreur:', error);
                                                alert('Erreur lors du téléchargement du PDF');
                                            }
                                        }}
                                        className="flex-1 md:size-14 rounded-2xl bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700 flex items-center justify-center hover:text-primary hover:border-primary/50 transition-all shadow-sm"
                                        title="Télécharger l'ordonnance PDF"
                                    >
                                        <span className="material-symbols-outlined text-[24px]">description</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DoctorLayout>
    );
};

export default ConsultationsMedecin;

