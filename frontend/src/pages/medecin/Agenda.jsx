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
            <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-primary/10 text-primary rounded-xl material-symbols-outlined text-[20px]">calendar_month</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Planning Quotidien</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-titles dark:text-white tracking-tighter leading-none italic uppercase">
                            Agenda Médical
                        </h1>
                        <p className="text-base text-slate-500 dark:text-slate-400 font-medium italic">Gérez vos rendez-vous et optimisez votre temps de consultation.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-[#1c2229] p-2 rounded-3xl border border-slate-100 dark:border-[#2d363f] shadow-sm">
                        <button className="px-8 py-3 rounded-2xl bg-primary text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">Aujourd'hui</button>
                        <button className="px-8 py-3 rounded-2xl text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cette Semaine</button>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1c2229] border border-slate-100 dark:border-[#2d363f] rounded-[3rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
                    {/* Background Decorative Element */}
                    <div className="absolute top-0 right-0 size-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                    <div className="flex items-center justify-between mb-12 overflow-x-auto pb-6 gap-6 no-scrollbar relative z-10">
                        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, i) => (
                            <button key={i} className={`flex flex-col items-center gap-4 min-w-[100px] p-6 rounded-[2.5rem] transition-all duration-500 ${i === 2 ? 'bg-primary text-white shadow-2xl shadow-primary/30 ring-8 ring-primary/5 scale-110' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-titles dark:hover:text-white'}`}>
                                <span className="text-[11px] font-black uppercase tracking-widest">{day}</span>
                                <span className="text-2xl font-black italic tracking-tighter">{20 + i}</span>
                                <div className={`size-1.5 rounded-full ${i === 2 ? 'bg-white' : 'bg-transparent'}`}></div>
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4 relative z-10">
                        {slots.map((slot, i) => (
                            <div key={i} className={`group flex flex-col sm:flex-row items-center gap-6 md:gap-10 p-5 md:p-6 rounded-[2rem] border transition-all duration-500 ${slot.status === 'booked' ? 'bg-white dark:bg-[#1e252d] border-primary/20 shadow-xl shadow-primary/5 border-l-8 border-l-primary' :
                                slot.status === 'busy' ? 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-60' :
                                    'bg-white dark:bg-[#1c2229] border-dashed border-slate-200 dark:border-slate-800 hover:border-primary/40 hover:bg-slate-50/50 cursor-pointer'
                                }`}>
                                <div className="min-w-[80px] text-lg font-black text-titles dark:text-white italic tracking-tighter drop-shadow-sm">{slot.time}</div>

                                <div className="flex-1 flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                        <span className={`text-base font-black uppercase tracking-tighter italic ${slot.status === 'free' ? 'text-slate-300' : 'text-titles dark:text-white'}`}>
                                            {slot.patient === 'Disponible' ? 'Créneau Libre' : slot.patient}
                                        </span>
                                        {slot.type && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic">{slot.type}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {slot.status === 'booked' && (
                                            <div className="flex items-center gap-3">
                                                <button className="h-12 px-6 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                                                    Consulter
                                                    <span className="material-symbols-outlined text-[18px]">stethoscope</span>
                                                </button>
                                                <button className="size-12 rounded-2xl bg-white dark:bg-slate-800 text-slate-400 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center hover:text-primary transition-all">
                                                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                </button>
                                            </div>
                                        )}
                                        {slot.status === 'free' && (
                                            <button className="h-12 px-8 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                                                Bloquer ce créneau
                                            </button>
                                        )}
                                        {slot.status === 'busy' && (
                                            <span className="px-5 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Indisponible</span>
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
