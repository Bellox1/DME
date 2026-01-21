import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DoctorLayout from '../../components/layouts/DoctorLayout';
import FirstLoginModal from '../../components/FirstLoginModal';

const DoctorDashboard = () => {
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
                    userPhone="+229 90 00 00 00"
                    onComplete={handleFirstLoginComplete}
                />
            )}

            <DoctorLayout>
                <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-8 transition-all duration-[800ms]">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase">
                            Bonjour, Dr. Kone 👋
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Votre planning est prêt pour aujourd'hui.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Consultations', value: '14', subValue: '8 réalisées', icon: 'stethoscope', color: 'bg-primary' },
                            { label: 'Attente Patient', value: '05', subValue: 'Salle d\'attente', icon: 'groups', color: 'bg-primary' },
                            { label: 'Urgences', value: '02', subValue: 'Prioritaire', icon: 'notification_important', color: 'bg-rose-500' },
                            { label: 'RDV Demain', value: '09', subValue: 'Planning chargé', icon: 'event', color: 'bg-amber-500' },
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
                        {/* Active Consultation Queue */}
                        <div className="lg:col-span-8 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-xl font-black text-titles dark:text-white tracking-tight">Prochains Patients</h3>
                                    <p className="text-xs text-slate-500 font-medium italic">File d'attente en temps réel</p>
                                </div>
                                <Link to="/medecin/agenda" className="h-10 px-6 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center">Voir l'agenda complet</Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-800">
                                            <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Patient</th>
                                            <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">ID / Type</th>
                                            <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Motif</th>
                                            <th className="px-4 py-3 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {[
                                            { name: 'Alice Patient', id: 'P-2026-001', type: 'Titulaire', motif: 'Consultation Routine', priority: 'bg-primary/10 text-primary' },
                                            { name: 'Léo Patient', id: 'P-2026-002', type: 'Enfant', motif: 'Vaccination', priority: 'bg-primary/10 text-primary' },
                                            { name: 'Jean Dupont', id: 'P-2026-089', type: 'Urgent', motif: 'Douleur abdominale', priority: 'bg-rose-500/10 text-rose-600' },
                                        ].map((row, i) => (
                                            <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-9 rounded-xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                                                            {row.name.charAt(0)}
                                                        </div>
                                                        <span className="text-sm font-bold text-titles dark:text-white uppercase tracking-tighter">{row.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 leading-none">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase">{row.id}</span>
                                                        <span className="text-[9px] font-bold text-slate-500 italic">{row.type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-xs font-bold text-slate-600 dark:text-slate-400">{row.motif}</td>
                                                <td className="px-4 py-4 text-right">
                                                    <button className="h-9 px-4 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">Consulter</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Quick Access Sidebar */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <div className="bg-gradient-to-br from-primary to-[#35577D] rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                                <h4 className="text-lg font-black mb-6 relative z-10 leading-tight uppercase tracking-wider">Actions Rapides</h4>
                                <div className="grid grid-cols-1 gap-4 relative z-10">
                                    <Link to="/medecin/patients" className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 group">
                                        <span className="material-symbols-outlined p-2 bg-white text-primary rounded-xl group-hover:scale-110 transition-transform">person_search</span>
                                        <span className="text-sm font-black tracking-tight leading-none uppercase text-left">Rechercher Dossier</span>
                                    </Link>
                                    <Link to="/medecin/ordonnances" className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 group">
                                        <span className="material-symbols-outlined p-2 bg-white text-primary rounded-xl group-hover:scale-110 transition-transform">prescriptions</span>
                                        <span className="text-sm font-black tracking-tight leading-none uppercase text-left">Émettre Ordonnance</span>
                                    </Link>
                                    <Link to="/medecin/resultats" className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 group">
                                        <span className="material-symbols-outlined p-2 bg-white text-primary rounded-xl group-hover:scale-110 transition-transform">lab_research</span>
                                        <span className="text-sm font-black tracking-tight leading-none uppercase text-left">Voir Analyses Labo</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Recent Notes / Reminders */}
                            <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm">
                                <h4 className="text-base font-black text-titles dark:text-white mb-6 uppercase tracking-widest leading-none italic">Notes & Rappels</h4>
                                <div className="space-y-4">
                                    {[
                                        { text: "Valider résultats dossier #P-2026-001", time: "Il y a 2h", type: "Urgent" },
                                        { text: "Appeler confrère (Dr. Dubois) pour avis", time: "16:00 today", type: "Rappel" },
                                    ].map((note, i) => (
                                        <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                            <p className="text-xs font-bold text-titles dark:text-white mb-2">{note.text}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{note.time}</span>
                                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${note.type === 'Urgent' ? 'bg-rose-100 text-rose-600' : 'bg-primary/10 text-primary'}`}>{note.type}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DoctorLayout>
        </>
    );
};

export default DoctorDashboard;

