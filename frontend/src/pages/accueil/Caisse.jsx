import React, { useState } from 'react';
import ReceptionLayout from '../../components/layouts/ReceptionLayout';

const CaisseFacturation = () => {
    return (
        <ReceptionLayout>
            <div className="p-8 max-w-7xl mx-auto w-full flex flex-col gap-8 transition-all duration-[800ms]">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-titles dark:text-white tracking-tight leading-none">Caisse & Facturation</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Gérez les encaissements et les factures des patients.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Invoice Generation / Recent Payments */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm">
                            <h3 className="text-xl font-black text-titles dark:text-white mb-8 tracking-tight uppercase">Dernières Factures</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-800">
                                            <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">N° Facture</th>
                                            <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Patient</th>
                                            <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Montant</th>
                                            <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Statut</th>
                                            <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {[
                                            { id: 'FAC-001', name: 'Alice Patient', amount: '15.000 F', status: 'Payé', color: 'bg-green-100 text-green-600' },
                                            { id: 'FAC-002', name: 'Jean Dupont', amount: '25.000 F', status: 'Impayé', color: 'bg-red-100 text-red-600' },
                                            { id: 'FAC-003', name: 'Koffi Mensah', status: 'Payé', amount: '12.500 F', color: 'bg-green-100 text-green-600' },
                                        ].map((fac, i) => (
                                            <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-4 py-5 text-sm font-black text-titles dark:text-white italic">{fac.id}</td>
                                                <td className="px-4 py-5 font-bold text-titles dark:text-white uppercase text-xs tracking-tighter">{fac.name}</td>
                                                <td className="px-4 py-5 font-black text-primary italic italic text-sm">{fac.amount}</td>
                                                <td className="px-4 py-5">
                                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${fac.color}`}>
                                                        {fac.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-5 text-right">
                                                    <button className="size-9 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary transition-all flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-[18px]">print</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Quick Billing Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-primary text-white rounded-[2.5rem] p-8 shadow-xl shadow-primary/20 relative overflow-hidden">
                            <h3 className="text-xl font-black mb-6 relative z-10 leading-tight">Nouvelle Facture</h3>
                            <div className="space-y-4 relative z-10">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase text-white/60 tracking-widest pl-1">Sélectionner Patient</label>
                                    <input type="text" placeholder="Rechercher..." className="w-full h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 text-sm font-bold placeholder:text-white/40 outline-none transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase text-white/60 tracking-widest pl-1">Montant à encaisser (F)</label>
                                    <input type="number" placeholder="0" className="w-full h-12 bg-white text-titles border-none rounded-xl px-4 text-sm font-black outline-none transition-all" />
                                </div>
                                <button className="w-full h-14 bg-white text-primary rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl mt-4 hover:scale-[1.02] active:scale-95 transition-all">Générer & Encaisser</button>
                            </div>
                            <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </ReceptionLayout>
    );
};

export default CaisseFacturation;
