import React, { useState } from 'react';
import PatientLayout from '../../components/layouts/PatientLayout';

const PatientProfil = () => {
    const [activeTab, setActiveTab] = useState('general');

    const [subAccounts] = useState([
        { id: 2, name: 'Léo Patient', role: 'Enfant', age: '8 ans', initial: 'LP', color: 'bg-blue-500' },
        { id: 3, name: 'Maya Patient', role: 'Enfant', age: '4 ans', initial: 'MP', color: 'bg-pink-500' },
    ]);

    return (
        <PatientLayout>
            <div className="p-4 md:p-8 max-w-6xl mx-auto w-full flex flex-col gap-8 md:gap-12 transition-all duration-[800ms]">
                {/* Header avec Bannière Premium */}
                <div className="relative">
                    {/* Bannière */}
                    <div className="h-48 md:h-56 rounded-[2rem] bg-gradient-to-r from-[#35577D] to-primary overflow-hidden shadow-xl relative">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:20px_20px]"></div>

                        {/* Nom et Rôle SUR l'arrière-plan */}
                        <div className="absolute bottom-6 md:bottom-10 left-36 md:left-48 right-6 flex flex-col gap-1 md:ml-4 animate-in fade-in slide-in-from-left-4 duration-700">
                            <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-white drop-shadow-lg tracking-tight uppercase italic transition-all leading-tight">Alice Patient</h1>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-md text-[9px] md:text-[10px] font-bold text-white uppercase tracking-widest border border-white/30">TITULAIRE</span>
                                <span className="size-1.5 rounded-full bg-green-400 shadow-sm animate-pulse"></span>
                                <span className="text-[10px] md:text-xs text-white/90 font-bold uppercase tracking-wide italic">Responsable Famille</span>
                            </div>
                        </div>
                    </div>
                    {/* Photo de Profil */}
                    <div className="absolute -bottom-8 left-6 md:left-12 z-20">
                        <div className="relative group">
                            <div className="size-28 md:size-36 rounded-3xl bg-white dark:bg-slate-900 p-1 md:p-1.5 shadow-2xl transition-transform hover:scale-105 duration-300">
                                <div className="size-full rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-slate-50 dark:border-slate-800">
                                    <span className="material-symbols-outlined text-primary text-5xl md:text-7xl">face</span>
                                </div>
                            </div>
                            <button className="absolute bottom-1 right-1 size-8 md:size-9 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center border-2 md:border-4 border-white dark:border-slate-900 hover:scale-110 transition-transform active:scale-95">
                                <span className="material-symbols-outlined text-[16px] md:text-[20px]">edit</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-4">
                    {/* Colonne Gauche: Navigation */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] p-2 md:p-2.5 shadow-sm lg:sticky lg:top-24 flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-2.5">
                            {[
                                { id: 'general', label: 'Compte', icon: 'person' },
                                { id: 'family', label: 'Sous-comptes', icon: 'group' },
                                { id: 'medical', label: 'Données Médicales', icon: 'monitor_heart' },
                                { id: 'security', label: 'Sécurité', icon: 'lock' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 shrink-0 lg:w-full px-5 py-3.5 rounded-2xl transition-all duration-300 lg:mb-1 ${activeTab === tab.id
                                        ? 'bg-primary text-white font-black shadow-lg shadow-primary/20 scale-[1.02]'
                                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[20px] md:text-[22px]">{tab.icon}</span>
                                    <span className="text-[11px] md:text-[13px] uppercase tracking-widest font-bold whitespace-nowrap">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Colonne Droite: Formulaires */}
                    <div className="lg:col-span-9">
                        {activeTab === 'general' && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] p-6 md:p-10 shadow-sm relative overflow-hidden">
                                <h3 className="text-lg md:text-xl font-black text-titles dark:text-white mb-8 md:mb-10 flex items-center gap-3 uppercase italic">
                                    <div className="size-10 md:size-11 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px] md:text-[24px]">badge</span>
                                    </div>
                                    Informations Personnelles
                                </h3>

                                <form className="space-y-8" onSubmit={e => e.preventDefault()}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em] pl-1">Nom de famille</label>
                                            <input type="text" defaultValue="PATIENT" className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none" />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em] pl-1">Prénom</label>
                                            <input type="text" defaultValue="Alice" className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em] pl-1">Sexe</label>
                                            <select className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none appearance-none cursor-pointer">
                                                <option value="F">Féminin</option>
                                                <option value="M">Masculin</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em] pl-1">Numéro de Téléphone</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">call</span>
                                                <input type="tel" defaultValue="+229 60 70 80 90" className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl pl-12 pr-5 text-sm font-bold text-titles dark:text-white transition-all outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em] pl-1">WhatsApp</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-green-500 text-[20px]">chat</span>
                                                <input type="tel" defaultValue="+229 60 70 80 90" className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl pl-12 pr-5 text-sm font-bold text-titles dark:text-white transition-all outline-none" />
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em] pl-1">ID Patient</label>
                                            <div className="h-14 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl px-5 flex items-center text-sm font-bold text-titles dark:text-white border border-transparent italic">
                                                P-2026-001
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button type="submit" className="w-full md:w-auto px-12 h-14 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2">
                                            <span>Mettre à jour mon profil</span>
                                            <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'family' && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 flex flex-col gap-8">
                                <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] p-6 md:p-10 shadow-sm">
                                    <div className="flex justify-between items-center mb-8 md:mb-10">
                                        <h3 className="text-lg md:text-xl font-black text-titles dark:text-white flex items-center gap-3 uppercase italic">
                                            <div className="size-10 md:size-11 shrink-0 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[20px] md:text-[24px]">group</span>
                                            </div>
                                            <span className="hidden sm:inline">Membres de la famille (Sous-comptes)</span>
                                            <span className="sm:hidden">Sous-comptes</span>
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {subAccounts.map(sub => (
                                            <div key={sub.id} className="p-6 rounded-3xl border border-slate-100 dark:border-[#2d363f] bg-slate-50/50 dark:bg-slate-900/30 flex items-center group transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className={`size-14 rounded-2xl ${sub.color} flex items-center justify-center text-white text-lg font-black shadow-lg shadow-black/5`}>
                                                        {sub.initial}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-base font-black text-titles dark:text-white">{sub.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{sub.role}</span>
                                                            <span className="size-1 rounded-full bg-slate-300"></span>
                                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{sub.age}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 md:p-8 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 flex flex-col sm:flex-row gap-4 md:gap-6 items-start">
                                    <div className="size-10 md:size-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
                                        <span className="material-symbols-outlined text-[20px] md:text-[24px]">info</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-xs md:text-sm font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-tight italic">À quoi servent les sous-comptes ?</h4>
                                        <p className="text-[11px] md:text-xs text-indigo-700/70 dark:text-indigo-400/70 font-medium leading-relaxed">
                                            Les sous-comptes vous permettent de gérer le dossier médical de vos enfants ou proches depuis votre propre compte sécurisé. Vous pouvez prendre des rendez-vous pour eux et consulter leurs résultats d'analyses.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'medical' && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] p-6 md:p-10 shadow-sm relative overflow-hidden">
                                <h3 className="text-lg md:text-xl font-black text-titles dark:text-white mb-8 md:mb-10 flex items-center gap-3 uppercase italic">
                                    <div className="size-10 md:size-11 shrink-0 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px] md:text-[24px]">monitor_heart</span>
                                    </div>
                                    Données Médicales de Base
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    {[
                                        { label: 'Groupe Sanguin', value: 'O+', icon: 'bloodtype' },
                                        { label: 'Taille', value: '172 cm', icon: 'height' },
                                        { label: 'Poids', value: '68 kg', icon: 'weight' },
                                    ].map((item, i) => (
                                        <div key={i} className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center gap-3">
                                            <span className="material-symbols-outlined text-primary/40 text-3xl">{item.icon}</span>
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{item.label}</p>
                                            <p className="text-xl font-black text-titles dark:text-white">{item.value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest pl-1">Allergies connues</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Pénicilline', 'Pollen', 'Arachides'].map((a, i) => (
                                                <span key={i} className="px-5 py-2.5 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-2xl text-xs font-bold border border-red-200 dark:border-red-900/40">
                                                    {a}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] p-6 md:p-10 shadow-sm overflow-hidden">
                                <h3 className="text-lg md:text-xl font-black text-titles dark:text-white mb-8 md:mb-10 flex items-center gap-3 uppercase italic">
                                    <div className="size-10 md:size-11 shrink-0 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px] md:text-[24px]">lock_reset</span>
                                    </div>
                                    Modification du mot de passe
                                </h3>

                                <form className="space-y-8" onSubmit={e => e.preventDefault()}>
                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider pl-1">Mot de passe actuel</label>
                                        <input type="password" placeholder="••••••••••••" className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 text-sm font-bold text-titles dark:text-white focus:ring-2 focus:ring-orange-500/20 transition-all outline-none" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider pl-1">Nouveau mot de passe</label>
                                            <input type="password" placeholder="••••••••••••" className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 text-sm font-bold text-titles dark:text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider pl-1">Confirmer le nouveau</label>
                                            <input type="password" placeholder="••••••••••••" className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 text-sm font-bold text-titles dark:text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                                        </div>
                                    </div>
                                    <div className="pt-6">
                                        <button type="submit" className="w-full md:w-auto px-12 h-14 bg-orange-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-95">
                                            Changer mon mot de passe
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
};

export default PatientProfil;
