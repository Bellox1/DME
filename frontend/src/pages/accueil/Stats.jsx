import React from 'react';
import ReceptionLayout from '../../components/layouts/ReceptionLayout';

const StatistiquesReception = () => {
    return (
        <ReceptionLayout>
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 transition-all duration-[800ms]">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase">Analyse de Performance</h1>
                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium">Vue d'ensemble de l'activité du centre.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-sm flex flex-col items-center text-center group hover:shadow-xl hover:shadow-primary/5 transition-all">
                        <div className="size-16 md:size-20 rounded-2xl md:rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-3xl md:text-4xl">group</span>
                        </div>
                        <h4 className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">Total Patients</h4>
                        <span className="text-3xl md:text-4xl font-black text-titles dark:text-white italic tracking-tighter">1,248</span>
                        <p className="text-[10px] text-green-500 font-black mt-3 md:mt-4 uppercase">+12% ce mois-ci</p>
                    </div>

                    <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-sm flex flex-col items-center text-center group hover:shadow-xl hover:shadow-primary/5 transition-all">
                        <div className="size-16 md:size-20 rounded-2xl md:rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-3xl md:text-4xl">calendar_month</span>
                        </div>
                        <h4 className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">Consultations</h4>
                        <span className="text-3xl md:text-4xl font-black text-titles dark:text-white italic tracking-tighter">324</span>
                        <p className="text-[10px] text-green-500 font-black mt-3 md:mt-4 uppercase">Activité stable</p>
                    </div>

                    <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-sm flex flex-col items-center text-center group hover:shadow-xl hover:shadow-primary/5 transition-all">
                        <div className="size-16 md:size-20 rounded-2xl md:rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-3xl md:text-4xl">speed</span>
                        </div>
                        <h4 className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">Temps Moyen</h4>
                        <span className="text-3xl md:text-4xl font-black text-titles dark:text-white italic tracking-tighter">14 min</span>
                        <p className="text-[10px] text-primary font-black mt-3 md:mt-4 uppercase">Par patient</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-sm">
                    <h3 className="text-lg md:text-xl font-black text-titles dark:text-white mb-6 md:mb-8 tracking-tight uppercase italic">Fréquentation Hebdomadaire</h3>
                    <div className="h-48 md:h-64 w-full flex items-end justify-between gap-2 md:gap-4 px-2 md:px-4 pb-6 md:pb-8">
                        {[45, 60, 35, 80, 50, 90, 40].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3 md:gap-4 group">
                                <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-t-xl md:rounded-t-2xl relative overflow-hidden flex items-end" style={{ height: '100%' }}>
                                    <div
                                        className="w-full bg-primary/20 group-hover:bg-primary/60 transition-all rounded-t-lg md:rounded-t-xl"
                                        style={{ height: `${h}%` }}
                                    ></div>
                                </div>
                                <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none">{['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ReceptionLayout>
    );
};

export default StatistiquesReception;
