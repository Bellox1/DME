import React from 'react';
import DoctorLayout from '../../components/layouts/DoctorLayout';

const StatsMedecin = () => {
    return (
        <DoctorLayout>
            <div className="p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 transition-all duration-[800ms]">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase">Performance & Analyse</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Visualisez l'activité de votre pratique médicale.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: 'Consultations (Mois)', value: '156', trend: '+12%', icon: 'summarize', color: 'bg-primary' },
                        { label: 'Temps moyen / Patient', value: '22m', trend: '-2m', icon: 'timer', color: 'bg-primary' },
                        { label: 'Taux de satisfaction', value: '98%', trend: '+1%', icon: 'task_alt', color: 'bg-emerald-500' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group">
                            <div className="flex justify-between items-start relative z-10">
                                <div className="flex flex-col gap-4">
                                    <div className={`size-12 rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                                        <span className="material-symbols-outlined">{stat.icon}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{stat.label}</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-titles dark:text-white italic tracking-tighter">{stat.value}</span>
                                            <span className={`text-[10px] font-black italic ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{stat.trend}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-10 shadow-sm h-96 flex flex-col justify-center items-center">
                    <div className="size-20 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 mb-4 animate-pulse">
                        <span className="material-symbols-outlined text-4xl">query_stats</span>
                    </div>
                    <p className="text-sm font-black text-titles dark:text-white uppercase tracking-widest italic">Graphique d'activité en cours de chargement...</p>
                    <p className="text-[10px] text-slate-400 font-medium">Collecte des données de Janvier 2026</p>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default StatsMedecin;
