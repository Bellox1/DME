import React, { useState, useEffect } from 'react';
import PatientLayout from '../../components/layouts/PatientLayout';

const PatientDashboard = () => {
    const [activeProfile, setActiveProfile] = useState({ name: 'Alice' });

    // Listen to profile changes in localStorage (mocking a context for now)
    useEffect(() => {
        const checkProfile = () => {
            const saved = localStorage.getItem('active-patient-profile');
            if (saved) {
                const profile = JSON.parse(saved);
                setActiveProfile(profile);
            }
        };

        checkProfile();
        window.addEventListener('storage', checkProfile);

        // Custom interval because storage event doesn't fire on the same page
        const interval = setInterval(checkProfile, 500);

        return () => {
            window.removeEventListener('storage', checkProfile);
            clearInterval(interval);
        };
    }, []);

    // Get first name for display
    const firstName = activeProfile.name.split(' ')[0];

    return (
        <PatientLayout>
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 md:gap-12 transition-all duration-[800ms]">
                {/* Welcome Section Premium Style */}
                <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-[#35577D] to-primary p-8 md:p-12 text-white shadow-2xl shadow-primary/20">
                    <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 size-48 bg-primary/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic">Espace Patient</span>
                                <span className="size-2 rounded-full bg-green-400 animate-ping"></span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none italic uppercase">
                                Bonjour, <span className="text-white/80">{activeProfile.name}</span> 👋
                            </h1>
                            <p className="text-lg text-white/70 font-medium italic max-w-md">
                                Content de vous revoir. Votre dossier de santé de {activeProfile.role === 'Titulaire' ? 'votre profil personnel' : activeProfile.name} est à jour.
                            </p>
                        </div>
                        <div className="hidden lg:flex items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-inner">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Date d'aujourd'hui</span>
                                <span className="text-xl font-black italic">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="size-12 rounded-2xl bg-white text-primary flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-[28px]">calendar_today</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Stat Cards */}
                    {[
                        { label: 'Prochain RDV', value: activeProfile.role === 'Titulaire' ? 'Demain, 10:00' : 'Aucun', icon: 'event', color: 'bg-blue-500' },
                        { label: 'Ordonnances actives', value: activeProfile.role === 'Titulaire' ? '3' : '1', icon: 'prescriptions', color: 'bg-primary' },
                        { label: 'Nouveaux résultats', value: activeProfile.role === 'Titulaire' ? '1' : '0', icon: 'lab_research', color: 'bg-green-500' },
                        { label: 'Médecins suivis', value: activeProfile.role === 'Titulaire' ? '4' : '2', icon: 'medical_services', color: 'bg-orange-500' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-[#1c2229] p-6 rounded-[2rem] border border-slate-200 dark:border-[#2d363f] shadow-sm flex flex-col gap-4">
                            <div className={`size-12 rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                                <span className="material-symbols-outlined">{stat.icon}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider font-display">{stat.label}</span>
                                <span className="text-xl font-black text-titles dark:text-white">{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Quick Actions / Recent RDV */}
                    <div className="lg:col-span-8 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-titles dark:text-white">Dernières activités</h3>
                            <button className="text-xs font-bold text-primary hover:underline">Voir tout</button>
                        </div>

                        <div className="space-y-4">
                            {activeProfile.role === 'Titulaire' ? (
                                <>
                                    {[
                                        { dr: 'Dr. Sarah Kone', spec: 'Cardiologue', date: '15 Jan 2026', time: '14:30', status: 'Terminé' },
                                        { dr: 'Dr. Marc Dubois', spec: 'Médecin Généraliste', date: '02 Jan 2026', time: '09:15', status: 'Terminé' },
                                    ].map((rdv, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm">
                                                    <span className="material-symbols-outlined">person</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-titles dark:text-white">{rdv.dr}</span>
                                                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{rdv.spec}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-12 text-right">
                                                <div className="hidden sm:flex flex-col">
                                                    <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Date & Heure</span>
                                                    <span className="text-sm font-bold text-titles dark:text-white">{rdv.date} à {rdv.time}</span>
                                                </div>
                                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full text-[10px] font-black uppercase">
                                                    {rdv.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="py-12 text-center">
                                    <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
                                        <span className="material-symbols-outlined text-3xl">history</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 font-bold">Aucune activité récente pour ce profil.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Profile Completeness or Reminders */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                        <div className="bg-gradient-to-br from-primary to-[#35577D] rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                            <h4 className="text-lg font-black mb-2 relative z-10">Dossier de {firstName}</h4>
                            <p className="text-xs text-white/80 mb-6 font-medium relative z-10">
                                {activeProfile.role === 'Titulaire'
                                    ? 'Complétez vos informations pour un meilleur suivi médical.'
                                    : `Assurez-vous que le dossier de ${firstName} est à jour.`}
                            </p>
                            <div className="w-full bg-white/20 h-2 rounded-full mb-2 overflow-hidden relative z-10">
                                <div className={`bg-white h-full ${activeProfile.role === 'Titulaire' ? 'w-[65%]' : 'w-[40%]'}`} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest relative z-10">{activeProfile.role === 'Titulaire' ? '65%' : '40%'} complété</span>
                            <button className="w-full mt-6 py-3 bg-white text-primary rounded-2xl font-black text-xs hover:bg-slate-50 transition-all shadow-lg active:scale-95 relative z-10">
                                Compléter maintenant
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
};

export default PatientDashboard;

