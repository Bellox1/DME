import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DoctorLayout from '../../components/layouts/DoctorLayout';
import medicalService from '../../services/medicalService';
import medecinService from '../../services/medecin/medecinService';
import TransferModal from '../../components/medecin/TransferModal';

const DossierPatient = () => {
    const { patientId } = useParams();
    const [patientData, setPatientData] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [printing, setPrinting] = useState(false);
    const [activeTab, setActiveTab] = useState('timeline'); // 'timeline', 'vitals', 'docs'
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    const handlePrint = async (consultationId) => {
        try {
            setPrinting(true);
            const response = await medecinService.generateOrdonnancePdf(consultationId);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (err) {
            console.error("Erreur lors de l'impression:", err);
            alert("Erreur lors de la génération du PDF.");
        } finally {
            setPrinting(false);
        }
    };

    useEffect(() => {
        const fetchDossier = async () => {
            try {
                setLoading(true);
                const response = await medicalService.getPatientHistory(patientId);
                if (response.success) {
                    setPatientData(response.data.patient);
                    setHistory(response.data.consultations);
                }
            } catch (err) {
                console.error("Erreur lors de la récupération du dossier:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDossier();
    }, [patientId]);

    if (loading) {
        return (
            <DoctorLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </DoctorLayout>
        );
    }

    if (!patientData) {
        return (
            <DoctorLayout>
                <div className="p-8 text-center bg-rose-50 text-rose-600 rounded-3xl m-8 font-black uppercase tracking-widest italic">
                    Dossier patient introuvable
                </div>
            </DoctorLayout>
        );
    }

    // Extract latest vitals and medical info from history
    const latestConsultation = history.length > 0 ? history[0] : null;
    const allergies = latestConsultation?.allergies || "Aucune allergie signalée";
    const antecedents = latestConsultation?.antecedents || "Aucun antécédent majeur";

    return (
        <DoctorLayout>
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* --- HEADER PATIENT : LE BANDEAU 360 --- */}
                <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#1c2229] to-[#2c3e50] p-8 md:p-12 text-white shadow-2xl">
                    <div className="absolute top-0 right-0 size-96 bg-primary/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                        <div className="flex items-center gap-8">
                            <div className="size-24 md:size-32 rounded-[2.5rem] bg-white text-primary flex items-center justify-center text-4xl md:text-5xl font-black shadow-2xl shadow-black/50 border-4 border-white/10 ring-8 ring-primary/10 transition-transform hover:scale-105 duration-500">
                                {patientData.nom_complet ? patientData.nom_complet[0] : 'P'}
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-4">
                                    <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">
                                        {patientData.nom_complet}
                                    </h1>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${patientData.sexe === 'Homme' ? 'bg-blue-500/20 text-blue-300' : 'bg-rose-500/20 text-rose-300'}`}>
                                        {patientData.sexe}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-6 text-white/60">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">fingerprint</span>
                                        <span className="text-xs font-black uppercase tracking-widest font-mono text-white marker:text-primary">
                                            #{patientData.numero_patient || patientData.id}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">cake</span>
                                        <span className="text-xs font-bold italic">{patientData.date_naissance ? new Date(patientData.date_naissance).toLocaleDateString('fr-FR') : 'Date inconnue'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                                        <span className="text-xs font-bold italic">{patientData.adresse || 'Adresse non renseignée'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full lg:w-auto">
                            <Link
                                to={`/medecin/nouvelle-consultation?patient_id=${patientData.id}`}
                                className="flex-1 lg:flex-none h-16 px-10 bg-primary text-white rounded-3xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                Consulter
                                <span className="material-symbols-outlined">stethoscope</span>
                            </Link>
                            <button
                                onClick={() => setIsTransferModalOpen(true)}
                                className="h-16 px-8 bg-white/10 hover:bg-white/20 text-white rounded-3xl text-[11px] font-black uppercase tracking-widest backdrop-blur-md transition-all flex items-center justify-center gap-3 border border-white/20 shadow-xl"
                            >
                                Transférer
                                <span className="material-symbols-outlined">move_up</span>
                            </button>
                        </div>
                    </div>

                    {/* Quick Vitals Strip */}
                    <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                        {[
                            { label: 'Groupe Sanguin', value: patientData.groupe_sanguin || '--', icon: 'bloodtype', color: 'text-rose-400' },
                            { label: 'Taille', value: patientData.taille ? `${patientData.taille} cm` : '--', icon: 'straighten', color: 'text-blue-400' },
                            { label: 'Poids', value: patientData.poids ? `${patientData.poids} kg` : '--', icon: 'monitor_weight', color: 'text-green-400' },
                            { label: 'Traitement en cours', value: latestConsultation ? 'Oui' : 'Non', icon: 'medical_services', color: 'text-amber-400' },
                        ].map((vital, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className={`size-12 rounded-2xl bg-white/5 flex items-center justify-center ${vital.color} group-hover:scale-110 transition-transform`}>
                                    <span className="material-symbols-outlined">{vital.icon}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{vital.label}</span>
                                    <span className="text-xl font-black italic">{vital.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- MAIN CONTENT (TIMELINE) --- */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="bg-white dark:bg-[#1c2229] rounded-[3rem] p-8 md:p-10 border border-slate-100 dark:border-[#2d363f] shadow-sm flex flex-col h-full min-h-[600px]">
                            <div className="flex items-center justify-between mb-10 border-b border-slate-50 dark:border-[#252c35] pb-6">
                                <div className="flex gap-8">
                                    {[
                                        { id: 'timeline', label: 'Historique des Visites', icon: 'history' },
                                        { id: 'docs', label: 'Documents & Labo', icon: 'folder_open' },
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-3 pb-6 -mb-6 transition-all relative ${activeTab === tab.id ? 'text-primary' : 'text-slate-400 opacity-60 hover:opacity-100'}`}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                                            <span className="text-[11px] font-black uppercase tracking-widest italic">{tab.label}</span>
                                            {activeTab === tab.id && (
                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full animate-in slide-in-from-left duration-300"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {activeTab === 'timeline' && (
                                <div className="flex-1 flex flex-col gap-8 relative pl-6">
                                    {/* Vertical Line */}
                                    <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200 dark:bg-[#2d363f]"></div>

                                    {history.length === 0 ? (
                                        <div className="flex-1 flex flex-col items-center justify-center opacity-50 italic">
                                            <span className="material-symbols-outlined text-5xl mb-4">folder_off</span>
                                            <p className="font-bold text-sm tracking-widest uppercase">Aucun historique de consultation</p>
                                        </div>
                                    ) : (
                                        history.map((visit, i) => (
                                            <div key={i} className="relative pl-12 group">
                                                {/* Bullet */}
                                                <div className="absolute left-[-4px] top-1.5 size-3 rounded-full bg-white dark:bg-[#1c2229] ring-4 ring-primary z-10 group-hover:scale-125 transition-transform"></div>

                                                <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-[2rem] p-6 hover:bg-white dark:hover:bg-[#1e252d] border border-transparent hover:border-slate-100 dark:hover:border-[#2d363f] transition-all duration-300 flex flex-col gap-4">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <span className="text-lg font-black text-titles dark:text-white uppercase italic tracking-tight">{visit.motif || "Consultation Routine"}</span>
                                                                <span className="text-[9px] font-black bg-primary/10 text-primary px-3 py-1 rounded-xl uppercase tracking-widest">{new Date(visit.dateH_visite).toLocaleDateString('fr-FR')}</span>
                                                            </div>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Par Dr. {visit.medecin?.nom || 'Inconnu'}</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handlePrint(visit.id)}
                                                                disabled={printing}
                                                                className={`size-10 rounded-xl flex items-center justify-center transition-all border shadow-sm ${printing ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border-green-500/20'}`}
                                                                title="Imprimer l'ordonnance"
                                                            >
                                                                <span className={`material-symbols-outlined text-[20px] ${printing ? 'animate-spin' : ''}`}>
                                                                    {printing ? 'progress_activity' : 'print'}
                                                                </span>
                                                            </button>
                                                            <Link to={`/medecin/consultations/${visit.id}`} className="size-10 rounded-xl bg-white dark:bg-slate-800 text-slate-400 flex items-center justify-center hover:text-primary hover:bg-primary/10 transition-all border border-slate-100 dark:border-slate-700 shadow-sm">
                                                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="flex flex-col gap-2 p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100/50 dark:border-slate-700/50">
                                                            <span className="text-[9px] font-black uppercase text-primary/60 tracking-widest italic">Diagnostic Final</span>
                                                            <p className="text-xs font-bold text-titles dark:text-white leading-relaxed italic line-clamp-2">{visit.diagnostic || 'RAS'}</p>
                                                        </div>
                                                        <div className="flex flex-col gap-2 p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100/50 dark:border-slate-700/50">
                                                            <span className="text-[9px] font-black uppercase text-green-500/60 tracking-widest italic">Prescriptions ({visit.prescriptions?.length || 0})</span>
                                                            <div className="flex flex-wrap gap-2 pt-1">
                                                                {visit.prescriptions?.slice(0, 3).map((p, j) => (
                                                                    <span key={j} className="text-[9px] font-bold bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-md italic">{p.nom_medicament}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'docs' && (
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6 animate-in zoom-in-95 duration-300">
                                    <div className="col-span-full py-20 text-center opacity-40 italic flex flex-col items-center">
                                        <span className="material-symbols-outlined text-6xl mb-4">lab_research</span>
                                        <p className="font-black uppercase tracking-[0.3em] text-[10px]">Aucun document attaché au dossier</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- SIDEBAR INFOS --- */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                        {/* Allergies & Antécédents */}
                        <div className="bg-rose-500 rounded-[3rem] p-10 text-white shadow-2xl shadow-rose-500/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-all"></div>
                            <h4 className="text-xl font-black mb-8 uppercase italic tracking-widest flex items-center justify-between">
                                Profil Alerte
                                <span className="material-symbols-outlined text-white">warning</span>
                            </h4>
                            <div className="space-y-6">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Allergies Identifiées</span>
                                    <p className="text-sm font-black italic">{allergies}</p>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Antécédents Majeurs</span>
                                    <p className="text-sm font-black italic">{antecedents}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Notes / Reminders (As in Dashboard) */}
                        <div className="bg-white dark:bg-[#1c2229] border border-slate-100 dark:border-[#2d363f] rounded-[3rem] p-10 shadow-sm flex-1">
                            <h4 className="text-base font-black text-titles dark:text-white uppercase tracking-widest italic mb-8">Dernière Observation</h4>
                            <div className="flex flex-col gap-6">
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 italic leading-relaxed">
                                    {latestConsultation?.observations_medecin || "Aucune note particulière ajoutée au dossier central lors de la dernière visite."}
                                </p>
                                <button className="w-full h-12 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all border border-dashed border-slate-200 dark:border-slate-700">
                                    Ajouter une note
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Transfer Modal */}
            <TransferModal
                patient={patientData}
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                onTransferComplete={() => {
                    // Logic after transfer (e.g., refresh data or show a generic toast)
                    console.log("Transfer complete");
                }}
            />
        </DoctorLayout>
    );
};

export default DossierPatient;
