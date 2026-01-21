import React, { useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';

const AdminProfil = () => {
    const [activeTab, setActiveTab] = useState('general');

    return (
        <AdminLayout>
            <div className="p-4 md:p-8 max-w-6xl mx-auto w-full flex flex-col gap-8 md:gap-12 transition-all duration-[800ms]">
                {/* Header avec Bannière Premium */}
                <div className="relative">
                    {/* Bannière */}
                    <div className="h-48 md:h-56 rounded-[2rem] bg-gradient-to-r from-primary to-[#35577D] overflow-hidden shadow-xl relative">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:20px_20px]"></div>

                        {/* Nom et Rôle SUR l'arrière-plan */}
                        <div className="absolute bottom-6 md:bottom-10 left-36 md:left-48 right-6 flex flex-col gap-1 md:ml-4 animate-in fade-in slide-in-from-left-4 duration-700">
                            <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-white drop-shadow-lg tracking-tight uppercase italic transition-all leading-tight">Jean Dupont</h1>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-md text-[9px] md:text-[10px] font-bold text-white uppercase tracking-widest border border-white/30">ADMIN</span>
                                <span className="size-1.5 rounded-full bg-green-400 shadow-sm animate-pulse"></span>
                                <span className="text-[10px] md:text-xs text-white/90 font-bold uppercase tracking-wide italic">Administrateur Système</span>
                            </div>
                        </div>
                    </div>
                    {/* Photo de Profil */}
                    <div className="absolute -bottom-8 left-6 md:left-12 z-20">
                        <div className="relative group">
                            <div className="size-28 md:size-36 rounded-3xl bg-white dark:bg-slate-900 p-1 md:p-1.5 shadow-2xl transition-transform hover:scale-105 duration-300">
                                <div className="size-full rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-slate-50 dark:border-slate-800">
                                    <span className="material-symbols-outlined text-primary text-5xl md:text-7xl">account_circle</span>
                                </div>
                            </div>
                            <button className="absolute bottom-1 right-1 size-8 md:size-9 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center border-2 md:border-4 border-white dark:border-slate-900 hover:scale-110 transition-transform active:scale-95">
                                <span className="material-symbols-outlined text-[16px] md:text-[20px]">photo_camera</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-4">
                    {/* Colonne Gauche: Navigation */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] p-2 md:p-2.5 shadow-sm lg:sticky lg:top-24 flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-2.5">
                            {[
                                { id: 'general', label: 'Informations', icon: 'person' },
                                { id: 'security', label: 'Sécurité', icon: 'security' },
                                { id: 'notifications', label: 'Notifications', icon: 'notifications' }
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
                                    <span className="text-[11px] md:text-[13px] uppercase tracking-widest font-bold">{tab.label}</span>
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
                                            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em] pl-1">Nom</label>
                                            <input type="text" defaultValue="DUPONT" className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none" />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em] pl-1">Prénom</label>
                                            <input type="text" defaultValue="Jean" className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em] pl-1">Sexe</label>
                                            <select className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none appearance-none cursor-pointer">
                                                <option value="M">Masculin</option>
                                                <option value="F">Féminin</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em] pl-1">Numéro de Téléphone</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">call</span>
                                                <input type="tel" defaultValue="+229 90 00 00 00" className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl pl-12 pr-5 text-sm font-bold text-titles dark:text-white transition-all outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em] pl-1">WhatsApp</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-green-500 text-[20px]">chat</span>
                                                <input type="tel" defaultValue="+229 90 00 00 00" className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl pl-12 pr-5 text-sm font-bold text-titles dark:text-white transition-all outline-none" />
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em] pl-1">Rôle Système</label>
                                            <div className="h-14 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl px-5 flex items-center text-sm font-bold text-titles dark:text-white border border-transparent italic">
                                                ADMIN_SUPER_USER
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button type="submit" className="w-full md:w-auto px-12 h-14 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2">
                                            <span>Mettre à jour le profil</span>
                                            <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] p-6 md:p-10 shadow-sm overflow-hidden">
                                <h3 className="text-lg md:text-xl font-black text-titles dark:text-white mb-8 md:mb-10 flex items-center gap-3 uppercase italic">
                                    <div className="size-10 md:size-11 shrink-0 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px] md:text-[24px]">lock_reset</span>
                                    </div>
                                    Modifier le mot de passe
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
                                            Changer le mot de passe
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] p-6 md:p-10 shadow-sm">
                                <h3 className="text-lg md:text-xl font-black text-titles dark:text-white mb-8 md:mb-10 flex items-center gap-3 uppercase italic">
                                    <div className="size-10 md:size-11 shrink-0 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px] md:text-[24px]">notifications_active</span>
                                    </div>
                                    Préférences de notification
                                </h3>

                                <div className="space-y-6">
                                    {[
                                        { title: 'Inscriptions utilisateurs', desc: 'Recevoir une notification lors d\'un nouveau compte.', icon: 'person_add' },
                                        { title: 'Alertes de sécurité', desc: 'Alertes sur les tentatives de connexion suspectes.', icon: 'gpp_maybe' },
                                        { title: 'Rapports hebdomadaires', desc: 'Résumé de l\'activité hebdomadaire du système.', icon: 'assessment' },
                                    ].map((pref, i) => (
                                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="size-11 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-700 shadow-sm">
                                                    <span className="material-symbols-outlined text-[20px]">{pref.icon}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-titles dark:text-white">{pref.title}</span>
                                                    <span className="text-[11px] text-slate-500 font-medium">{pref.desc}</span>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                                                <div className="w-12 h-6.5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminProfil;
