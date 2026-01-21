import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReceptionLayout from '../../components/layouts/ReceptionLayout';
import FirstLoginModal from '../../components/FirstLoginModal';

const ReceptionDashboard = () => {
    const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);

    useEffect(() => {
        const isFirstLogin = localStorage.getItem('user-first-login') !== 'false';
        if (isFirstLogin) {
            setShowFirstLoginModal(true);
        }
    }, []);

    const handleFirstLoginComplete = () => {
        localStorage.setItem('user-first-login', 'false');
        setShowFirstLoginModal(false);
    };

    return (
        <>
            {showFirstLoginModal && (
                <FirstLoginModal
                    userPhone="+229 97 00 00 00"
                    onComplete={handleFirstLoginComplete}
                />
            )}

            <ReceptionLayout>
                <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-8 transition-all duration-[800ms]">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase">
                            Bonjour, Assane 👋
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Prêt pour une nouvelle journée d'accueil ?</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Attente Totale', value: '12', subValue: '7 urgents', icon: 'pending_actions', color: 'bg-primary' },
                            { label: 'Demandes RDV', value: '05', subValue: 'En attente', icon: 'event_note', color: 'bg-blue-500' },
                            { label: 'Nouveaux Patients', value: '08', subValue: 'Aujourd\'hui', icon: 'person_add', color: 'bg-amber-500' },
                            { label: 'Caisse Journalière', value: '142.500', subValue: 'FCFA', icon: 'account_balance_wallet', color: 'bg-rose-500' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white dark:bg-[#1c2229] p-6 rounded-[2rem] border border-slate-200 dark:border-[#2d363f] shadow-sm flex flex-col gap-4 group hover:shadow-xl hover:shadow-primary/5 transition-all">
                                <div className={`size-12 rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
                                    <span className="material-symbols-outlined">{stat.icon}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] mb-1">{stat.label}</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-black text-titles dark:text-white italic tracking-tighter">{stat.value}</span>
                                        <span className="text-[10px] font-bold text-slate-400">{stat.subValue}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Active Queue Table */}
                        <div className="lg:col-span-8 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 md:p-8">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-lg md:text-xl font-black text-titles dark:text-white tracking-tight">File d'attente actuelle</h3>
                                    <p className="text-xs text-slate-500 font-medium italic">Progression en temps réel des patients</p>
                                </div>
                                <Link to="/accueil/file-attente" className="w-full sm:w-auto h-10 px-6 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center">Gérer la file</Link>
                            </div>

                            <div className="overflow-x-auto px-4 md:px-8 pb-4 md:pb-8">
                                <table className="w-full min-w-[600px]">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-800">
                                            <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Patient</th>
                                            <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Service</th>
                                            <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Attente</th>
                                            <th className="px-4 py-3 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {[
                                            { name: 'Koffi Mensah', id: 'P-2026-114', service: 'Cardiologie', time: '12 min', status: 'En attente', color: 'bg-primary/10 text-primary' },
                                            { name: 'Sika Yao', id: 'P-2026-089', service: 'Généraliste', time: '05 min', status: 'En examen', color: 'bg-amber-100 text-amber-600' },
                                            { name: 'Amadou Diallo', id: 'P-2026-142', service: 'Laboratoire', time: '22 min', status: 'En attente', color: 'bg-primary/10 text-primary' },
                                            { name: 'Fatou Sow', id: 'P-2026-156', service: 'Pédiatrie', time: '02 min', status: 'Arrivée', color: 'bg-primary/10 text-primary' },
                                        ].map((row, i) => (
                                            <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-9 rounded-xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary font-black text-xs shrink-0">
                                                            {row.name.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col leading-none min-w-0">
                                                            <span className="text-sm font-bold text-titles dark:text-white uppercase tracking-tighter truncate">{row.name}</span>
                                                            <span className="text-[10px] text-slate-400 font-medium">{row.id}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-xs font-bold text-slate-600 dark:text-slate-400">{row.service}</td>
                                                <td className="px-4 py-4 text-xs font-black text-titles dark:text-white italic">{row.time}</td>
                                                <td className="px-4 py-4 text-right">
                                                    <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase whitespace-nowrap ${row.color}`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Quick Actions Sidebar */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <div className="bg-gradient-to-br from-primary to-[#35577D] rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                                <h4 className="text-lg font-black mb-6 relative z-10 leading-tight uppercase tracking-wider">Actions Rapides</h4>
                                <div className="grid grid-cols-1 gap-4 relative z-10">
                                    <Link to="/accueil/enregistrement" className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 group">
                                        <span className="material-symbols-outlined p-2 bg-white text-primary rounded-xl group-hover:scale-110 transition-transform">person_add</span>
                                        <span className="text-sm font-black tracking-tight leading-none uppercase text-left">Nouveau Patient</span>
                                    </Link>
                                    <Link to="/accueil/rdv" className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 group">
                                        <span className="material-symbols-outlined p-2 bg-white text-primary rounded-xl group-hover:scale-110 transition-transform">calendar_today</span>
                                        <span className="text-sm font-black tracking-tight leading-none uppercase text-left">Fixer un Rendez-vous</span>
                                    </Link>
                                    <button className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 group">
                                        <span className="material-symbols-outlined p-2 bg-white text-primary rounded-xl group-hover:scale-110 transition-transform">qr_code_scanner</span>
                                        <span className="text-sm font-black tracking-tight leading-none uppercase text-left">Scanner une Carte</span>
                                    </button>
                                </div>
                            </div>

                            {/* Summary of Today's Revenue */}
                            <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm">
                                <h4 className="text-base font-black text-titles dark:text-white mb-6 uppercase tracking-widest leading-none italic">Récapitulatif Caisse</h4>
                                <div className="space-y-6">
                                    {[
                                        { label: 'Espèces', value: '85.000', color: 'bg-emerald-500' },
                                        { label: 'Mobile Money', value: '42.500', color: 'bg-blue-500' },
                                        { label: 'Assurances', value: '15.000', color: 'bg-primary' },
                                    ].map((pay, i) => (
                                        <div key={i} className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center px-1">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{pay.label}</span>
                                                <span className="text-xs font-black text-titles dark:text-white italic">{pay.value} F</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className={`${pay.color} h-full transition-all duration-1000`} style={{ width: i === 0 ? '60%' : i === 1 ? '30%' : '10%' }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Nouvelles Demandes de RDV */}
                            <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-4 md:mb-6">
                                    <h4 className="text-sm md:text-base font-black text-titles dark:text-white uppercase tracking-widest leading-none italic">Demandes RDV</h4>
                                    <span className="size-6 md:size-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-black">5</span>
                                </div>
                                <div className="space-y-2 md:space-y-3">
                                    {[
                                        { patient: 'Marie Kouassi', date: '22 Jan', time: '10:00', reason: 'Consultation générale' },
                                        { patient: 'Kofi Mensah', date: '22 Jan', time: '14:30', reason: 'Suivi cardiologie' },
                                        { patient: 'Fatou Sow', date: '23 Jan', time: '09:00', reason: 'Contrôle pédiatrie' },
                                    ].map((rdv, i) => (
                                        <div key={i} className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all group">
                                            <div className="size-9 md:size-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xs shrink-0">
                                                {rdv.patient.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-titles dark:text-white truncate">{rdv.patient}</p>
                                                <p className="text-[10px] text-slate-500 font-medium truncate">{rdv.reason}</p>
                                            </div>
                                            <div className="flex flex-col items-end shrink-0">
                                                <span className="text-[10px] font-black text-primary whitespace-nowrap">{rdv.date}</span>
                                                <span className="text-[9px] text-slate-400 font-bold">{rdv.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Link to="/accueil/rdv" className="mt-3 md:mt-4 w-full h-10 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all flex items-center justify-center">
                                    Voir toutes les demandes
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </ReceptionLayout>
        </>
    );
};

export default ReceptionDashboard;

