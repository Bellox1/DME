import React from 'react';
import DoctorLayout from '../../components/layouts/DoctorLayout';

const ConsultationsMedecin = () => {
    const consultations = [
        { patient: 'Alice Patient', date: '21/01/2026', time: '09:00', type: 'Suivi', diagnosis: 'Hypertension stable' },
        { patient: 'Léo Patient', date: '21/01/2026', time: '10:30', type: 'Première visite', diagnosis: 'Angine virale' },
        { patient: 'Jean Dupont', date: '20/01/2026', time: '14:20', type: 'Urgence', diagnosis: 'Tachycardie subite' },
    ];

    return (
        <DoctorLayout>
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 transition-all duration-[800ms]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase transition-all">Historique des Consultations</h1>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium italic">Gérez vos comptes rendus médicaux et diagnostics.</p>
                    </div>
                    <button className="w-full sm:w-auto h-12 px-6 md:px-8 bg-primary text-white rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                        Nouvelle Consultation
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:gap-6">
                    {consultations.map((c, i) => (
                        <div key={i} className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] p-5 md:p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group border-l-4 md:border-l-8 border-l-primary">
                            <div className="flex flex-col gap-4 md:gap-6">
                                <div className="flex items-center gap-4 md:gap-5">
                                    <div className="size-12 md:size-14 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined text-[28px] md:text-[32px]">stethoscope</span>
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="text-base md:text-lg font-black text-titles dark:text-white uppercase tracking-tighter truncate">{c.patient}</span>
                                        <span className="text-[11px] md:text-xs font-bold text-slate-400 italic">Le {c.date} à {c.time}</span>
                                    </div>
                                </div>

                                <div className="flex-1 px-4 py-3 border-l-2 border-slate-100 dark:border-slate-800 ml-0 md:ml-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-r-xl">
                                    <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Diagnostic</span>
                                    <p className="text-xs md:text-sm font-bold text-titles dark:text-white italic leading-relaxed">"{c.diagnosis}"</p>
                                </div>

                                <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                                    <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">{c.type}</span>
                                    <div className="flex items-center gap-2 ml-auto">
                                        <button className="size-9 md:size-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                            <span className="material-symbols-outlined text-[18px] md:text-[20px]">visibility</span>
                                        </button>
                                        <button className="size-9 md:size-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:text-primary transition-all">
                                            <span className="material-symbols-outlined text-[18px] md:text-[20px]">edit</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DoctorLayout>
    );
};

export default ConsultationsMedecin;
