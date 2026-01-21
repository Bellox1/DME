import React from 'react';
import DoctorLayout from '../../components/layouts/DoctorLayout';

const AgendaMedecin = () => {
    const slots = [
        { time: '08:00', patient: 'Disponible', status: 'free' },
        { time: '08:30', patient: 'Alice Patient', status: 'booked', type: 'Consultation' },
        { time: '09:00', patient: 'Disponible', status: 'free' },
        { time: '09:30', patient: 'Jean Dupont', status: 'booked', type: 'Examen' },
        { time: '10:00', patient: 'Disponible', status: 'free' },
        { time: '10:30', patient: 'Léo Patient', status: 'booked', type: 'Vaccin' },
        { time: '11:00', patient: 'Pause Médicale', status: 'busy' },
    ];

    return (
        <DoctorLayout>
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 transition-all duration-[800ms]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase transition-all">Calendrier des RDV</h1>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium italic">Suivez votre planning quotidien et hebdomadaire.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-[#1c2229] p-2 rounded-2xl border border-slate-200 dark:border-[#2d363f] shadow-sm">
                        <button className="px-5 py-2.5 rounded-xl bg-primary text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Aujourd'hui</button>
                        <button className="px-5 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Semaine</button>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-10 overflow-x-auto pb-4 gap-8">
                        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day, i) => (
                            <button key={i} className={`flex flex-col items-center gap-2 min-w-[70px] p-4 rounded-2xl transition-all ${i === 2 ? 'bg-primary text-white shadow-xl shadow-primary/30 ring-4 ring-primary/10' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                <span className="text-[10px] font-black uppercase tracking-widest">{day}</span>
                                <span className="text-xl font-black italic">{20 + i}</span>
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {slots.map((slot, i) => (
                            <div key={i} className={`flex items-center gap-4 md:gap-8 p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all ${slot.status === 'booked' ? 'bg-primary/5 dark:bg-primary/10 border-primary/10 dark:border-primary/30' :
                                slot.status === 'busy' ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 opacity-60' :
                                    'bg-white dark:bg-[#1c2229] border-dashed border-slate-200 dark:border-slate-800 hover:border-primary/30 dark:hover:border-primary/50 cursor-pointer'
                                }`}>
                                <div className="min-w-[70px] text-sm font-black text-titles dark:text-white italic">{slot.time}</div>
                                <div className="flex-1 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className={`text-[13px] font-black uppercase tracking-tight ${slot.status === 'free' ? 'text-slate-300' : 'text-titles dark:text-white'}`}>{slot.patient}</span>
                                        {slot.type && <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{slot.type}</span>}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {slot.status === 'booked' && (
                                            <>
                                                <button className="size-9 rounded-xl bg-white dark:bg-slate-800 text-primary shadow-sm border border-primary/10 dark:border-primary/30 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                                    <span className="material-symbols-outlined text-[18px]">stethoscope</span>
                                                </button>
                                                <button className="size-9 rounded-xl bg-white dark:bg-slate-800 text-slate-400 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center hover:text-primary transition-all">
                                                    <span className="material-symbols-outlined text-[18px]">more_vert</span>
                                                </button>
                                            </>
                                        )}
                                        {slot.status === 'free' && (
                                            <button className="h-9 px-4 bg-white dark:bg-slate-800 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-800 hover:border-primary hover:text-primary transition-all">Bloquer</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default AgendaMedecin;
