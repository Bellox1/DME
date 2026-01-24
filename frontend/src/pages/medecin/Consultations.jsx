import React, { useState, useEffect } from 'react';
import DoctorLayout from '../../components/layouts/DoctorLayout';
import { consultationService, patientService } from '../../services';

const ConsultationsMedecin = () => {
    const [consultations, setConsultations] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Dans une version plus avancée, on filtrerait par médecin
                const patientsData = await patientService.getAllPatients();
                setPatients(patientsData);

                // Récupérer les consultations pour chaque patient (ou une liste globale si elle existe)
                // Comme on n'a pas de getAllConsultations global dans le service, 
                // on va simuler en récupérant les consultations de tous les patients chargés
                const allConsultationsPromises = patientsData.map(p =>
                    consultationService.getPatientConsultations(p.id).catch(() => [])
                );

                const results = await Promise.all(allConsultationsPromises);
                const flattenedConsultations = results.flat().sort((a, b) =>
                    new Date(b.created_at) - new Date(a.created_at)
                );

                setConsultations(flattenedConsultations);
            } catch (err) {
                console.error('Erreur chargement consultations:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getPatientName = (patientId) => {
        const patient = patients.find(p => p.id === parseInt(patientId));
        return patient ? `${patient.nom} ${patient.prenom}` : `Patient #${patientId}`;
    };

    return (
        <DoctorLayout>
            <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-8 md:gap-12 transition-all duration-1000 animate-in fade-in slide-in-from-bottom-4">

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
                    <button className="w-full md:w-auto h-14 px-10 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
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
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">{new Date(c.created_at).toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
                                    <span className="text-3xl font-black italic tracking-tighter tabular-nums mb-1">{new Date(c.created_at).getDate()}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{new Date(c.created_at).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                                </div>

                                {/* Main Info */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <h4 className="text-xl md:text-2xl font-black text-titles dark:text-white uppercase tracking-tighter italic flex items-center gap-3">
                                            {getPatientName(c.patient_id)}
                                            <span className="size-1.5 rounded-full bg-primary/30"></span>
                                            <span className="text-xs font-bold text-slate-400 tracking-normal non-italic">ID #{c.patient_id}</span>
                                        </h4>
                                        <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-[9px] font-black uppercase tracking-widest w-fit border border-indigo-100 dark:border-indigo-500/20">
                                            {c.type || 'Suivi Clinique'}
                                        </span>
                                    </div>

                                    <div className="relative pl-6 py-2 border-l-4 border-slate-100 dark:border-slate-800 group-hover:border-primary/20 transition-all">
                                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-2">Diagnostic & Observations</span>
                                        <p className="text-sm md:text-base font-bold text-titles dark:text-white italic leading-relaxed opacity-80 group-hover:opacity-100">
                                            "{c.motif || c.diagnostic || 'Compte rendu en cours de finalisation par le médecin...'}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6 text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">schedule</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest italic">{new Date(c.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">medical_information</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest italic">Dr. {c.medecin_nom || 'Intervenant'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Column */}
                                <div className="flex md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                                    <button className="flex-1 md:size-14 rounded-2xl bg-primary text-white flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-xl shadow-primary/20 group/btn">
                                        <span className="material-symbols-outlined text-[24px]">visibility</span>
                                    </button>
                                    <button className="flex-1 md:size-14 rounded-2xl bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700 flex items-center justify-center hover:text-primary hover:border-primary/50 transition-all shadow-sm">
                                        <span className="material-symbols-outlined text-[24px]">description</span>
                                    </button>
                                    <button className="flex-1 md:size-14 rounded-2xl bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700 flex items-center justify-center hover:text-rose-500 hover:border-rose-500/50 transition-all shadow-sm">
                                        <span className="material-symbols-outlined text-[24px]">share</span>
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

