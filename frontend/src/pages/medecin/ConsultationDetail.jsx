import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DoctorLayout from '../../components/layouts/DoctorLayout';
import medecinService from '../../services/medecin/medecinService';

const ConsultationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [consultation, setConsultation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [printing, setPrinting] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                const response = await medecinService.getConsultation(id);
                if (response.success) {
                    setConsultation(response.data);
                }
            } catch (err) {
                console.error("Erreur chargement consultation:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handlePrint = async () => {
        try {
            setPrinting(true);
            const response = await medecinService.generateOrdonnancePdf(id);
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

    if (loading) {
        return (
            <DoctorLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="size-16 rounded-full border-4 border-primary/10 border-t-primary animate-spin"></div>
                    <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] italic">Chargement du compte rendu...</p>
                </div>
            </DoctorLayout>
        );
    }

    if (!consultation) {
        return (
            <DoctorLayout>
                <div className="p-8 text-center bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 rounded-3xl m-8 font-black uppercase tracking-widest italic flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined text-4xl">error</span>
                    Consultation introuvable
                    <button onClick={() => navigate(-1)} className="mt-4 text-[10px] underline">Retour</button>
                </div>
            </DoctorLayout>
        );
    }

    return (
        <DoctorLayout>
            <div className="p-4 md:p-8 max-w-6xl mx-auto w-full flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate(-1)} className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary transition-all flex items-center justify-center">
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Compte Rendu Clinique</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-titles dark:text-white tracking-tighter italic uppercase">
                            Consultation <span className="text-primary italic">#{id}</span>
                        </h1>
                        <p className="text-base text-slate-500 dark:text-slate-400 font-medium italic">
                            Effectuée le {new Date(consultation.dateH_visite).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <button
                            onClick={handlePrint}
                            disabled={printing}
                            className={`flex-1 md:flex-none h-14 px-8 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${printing ? 'bg-slate-100 text-slate-400' : 'bg-green-500 text-white shadow-xl shadow-green-500/20 hover:scale-105'}`}
                        >
                            <span className={`material-symbols-outlined ${printing ? 'animate-spin' : ''}`}>
                                {printing ? 'progress_activity' : 'print'}
                            </span>
                            {printing ? 'Génération...' : 'Imprimer Ordonnance'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- MAIN CONTENT --- */}
                    <div className="lg:col-span-2 flex flex-col gap-8">

                        {/* Clinical Summary Card */}
                        <div className="bg-white dark:bg-[#1c2229] border border-slate-100 dark:border-[#2d363f] rounded-[3rem] p-8 md:p-10 shadow-sm flex flex-col gap-8">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-primary">
                                        <span className="material-symbols-outlined text-[20px]">psychiatry</span>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest italic">Motif de consultation</h4>
                                    </div>
                                    <p className="text-base font-bold text-titles dark:text-white italic bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                                        {consultation.motif || "Non spécifié"}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-primary">
                                        <span className="material-symbols-outlined text-[20px]">fact_check</span>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest italic">Diagnostic Final</h4>
                                    </div>
                                    <p className="text-base font-bold text-titles dark:text-white italic bg-primary/5 p-6 rounded-3xl border border-primary/10">
                                        {consultation.diagnostic || "R.A.S"}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <span className="material-symbols-outlined text-[20px]">list_alt</span>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest italic">Observations & Traitement</h4>
                                </div>
                                <div className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed space-y-4">
                                    <p>{consultation.observations_medecin || "Aucune observation supplémentaire."}</p>
                                    {consultation.traitement && (
                                        <div className="mt-4 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-l-4 border-primary italic">
                                            {consultation.traitement}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Prescription List */}
                        <div className="bg-white dark:bg-[#1c2229] border border-slate-100 dark:border-[#2d363f] rounded-[3rem] p-8 md:p-10 shadow-sm">
                            <h3 className="text-lg font-black text-titles dark:text-white uppercase tracking-widest italic mb-8 flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">pill</span>
                                Médicaments Prescrits
                            </h3>

                            <div className="grid grid-cols-1 gap-4">
                                {consultation.prescriptions && consultation.prescriptions.length > 0 ? (
                                    consultation.prescriptions.map((p, j) => (
                                        <div key={j} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-transparent hover:border-primary/20 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-2xl bg-white dark:bg-slate-800 text-primary flex items-center justify-center shadow-sm">
                                                    <span className="material-symbols-outlined">medication</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-base font-black text-titles dark:text-white uppercase tracking-tight italic">{p.nom_medicament}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.dosage}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-bold text-primary italic bg-primary/10 px-4 py-2 rounded-xl">
                                                    {p.instructions || "Selon posologie standard"}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 opacity-30 italic">
                                        <p className="text-sm font-black uppercase tracking-widest">Aucune prescription associée</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- SIDEBAR --- */}
                    <div className="flex flex-col gap-8">

                        {/* Patient Summary Card */}
                        <div className="bg-[#1c2229] rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 size-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8 italic">Patient Relatif</h4>

                            <div className="flex items-center gap-5 mb-10">
                                <div className="size-16 rounded-2xl bg-white text-primary flex items-center justify-center text-2xl font-black shadow-xl">
                                    {consultation.patient?.nom_complet ? consultation.patient.nom_complet[0] : 'P'}
                                </div>
                                <div className="flex flex-col">
                                    <Link to={`/medecin/patient/${consultation.patient_id}`} className="text-xl font-black italic uppercase tracking-tighter hover:text-primary transition-colors">
                                        {consultation.patient?.nom_complet || "Patient Inconnu"}
                                    </Link>
                                    <span className="text-[10px] font-bold text-white/50 tracking-widest">#{consultation.patient?.numero_patient || consultation.patient_id}</span>
                                </div>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-white/10">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Derniers Antécédents</span>
                                    <p className="text-xs font-bold italic line-clamp-2">{consultation.antecedents || "Aucun signalé"}</p>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Allergies Critiques</span>
                                    <p className="text-xs font-bold italic text-rose-400">{consultation.allergies || "Aucune signalée"}</p>
                                </div>
                            </div>

                            <Link to={`/medecin/patient/${consultation.patient_id}`} className="mt-10 w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all">
                                Voir Dossier Complet
                                <span className="material-symbols-outlined text-sm text-primary">open_in_new</span>
                            </Link>
                        </div>

                        {/* Medical Signature */}
                        <div className="bg-white dark:bg-[#1c2229] border border-slate-100 dark:border-[#2d363f] rounded-[3rem] p-8 shadow-sm text-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 block italic">Signature Validée</span>
                            <div className="py-8 grayscale opacity-60 flex items-center justify-center">
                                {consultation.signature ? (
                                    <img src={consultation.signature} alt="Signature Médecin" className="max-h-24 w-auto object-contain" />
                                ) : (
                                    <div className="italic text-slate-300 pointer-events-none select-none">Signature non disponible</div>
                                )}
                            </div>
                            <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
                                <p className="text-sm font-black text-titles dark:text-white italic uppercase tracking-tight">Dr. {consultation.medecin?.nom || "Inconnu"} {consultation.medecin?.prenom || ""}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Praticien DME</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default ConsultationDetail;
