import React, { useState, useEffect } from 'react';
import DoctorLayout from '../../components/layouts/DoctorLayout';
import medecinService from '../../services/medecin/medecinService';

const StatsMedecin = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await medecinService.getStats();
                if (response.success) {
                    setStats(response.data);
                }
            } catch (err) {
                console.error('Erreur lors du chargement des statistiques:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <DoctorLayout>
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6 md:gap-8 transition-all duration-[800ms]">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase transition-all">Performance & Analyse</h1>
                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium italic">Visualisez l'activité réelle de votre pratique médicale.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            {stats?.cards.map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all">
                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="flex flex-col gap-4">
                                            <div className={`size-11 md:size-12 rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                                                <span className="material-symbols-outlined text-[22px] md:text-[24px]">{stat.icon}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{stat.label}</span>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-2xl md:text-3xl font-black text-titles dark:text-white italic tracking-tighter">{stat.value}</span>
                                                    <span className={`text-[9px] md:text-[10px] font-black italic ${stat.trend.startsWith('+') ? 'text-emerald-500' : stat.trend.includes('%') ? 'text-rose-500' : 'text-slate-400'}`}>{stat.trend}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-6 md:p-10 shadow-sm">
                            <h3 className="text-lg md:text-xl font-black text-titles dark:text-white tracking-tight uppercase italic flex items-center gap-3 mb-10">
                                <span className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[18px]">show_chart</span>
                                </span>
                                Évolution des Consultations
                            </h3>

                            <div className="overflow-x-auto">
                                <div className="h-64 md:h-80 min-w-[600px] w-full flex items-end justify-between gap-2 md:gap-4 px-4 pb-8">
                                    {stats?.chart.map((item, i) => {
                                        const maxValue = Math.max(...stats.chart.map(m => m.value)) || 1;
                                        const heightPercent = (item.value / maxValue) * 100;

                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                                <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-t-2xl relative overflow-hidden flex items-end" style={{ height: '100%' }}>
                                                    <div
                                                        className="w-full bg-primary/20 group-hover:bg-primary transition-all rounded-t-xl"
                                                        style={{ height: `${Math.max(heightPercent, 5)}%` }}
                                                    >
                                                        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-titles text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {item.value}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-black text-slate-400 leading-none uppercase">
                                                    {item.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DoctorLayout>
    );
};

export default StatsMedecin;
