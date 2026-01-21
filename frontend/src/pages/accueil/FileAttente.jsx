import React from 'react';
import ReceptionLayout from '../../components/layouts/ReceptionLayout';

const FileAttente = () => {
    return (
        <ReceptionLayout>
            <div className="p-8 max-w-7xl mx-auto w-full flex flex-col gap-8 transition-all duration-[800ms]">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-titles dark:text-white tracking-tight leading-none">Gestion de la File d'attente</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">Optimisez le flux des patients en temps réel.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Active Queue Control */}
                    <div className="lg:col-span-12 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">N° Ticket</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Patient</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Service</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Priorité</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {[
                                        { ticket: 'A-012', name: 'Koffi Mensah', service: 'Cardiologie', priority: 'Urgente', color: 'bg-red-100 text-red-600' },
                                        { ticket: 'C-089', name: 'Sika Yao', service: 'Généraliste', priority: 'Normale', color: 'bg-blue-100 text-blue-600' },
                                        { ticket: 'B-142', name: 'Amadou Diallo', service: 'Laboratoire', priority: 'Normale', color: 'bg-blue-100 text-blue-600' },
                                        { ticket: 'A-015', name: 'Fatou Sow', service: 'Pédiatrie', priority: 'Prioritaire', color: 'bg-primary/10 text-primary' },
                                    ].map((row, i) => (
                                        <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-6 font-black text-titles dark:text-white italic">{row.ticket}</td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col leading-none">
                                                    <span className="text-sm font-black text-titles dark:text-white uppercase tracking-tighter mb-1">{row.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold">Inscrit à 09:20</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{row.service}</td>
                                            <td className="px-6 py-6">
                                                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase ${row.color}`}>
                                                    {row.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button className="h-9 px-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Appeler</button>
                                                    <button className="size-9 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-[18px]">cancel</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </ReceptionLayout>
    );
};

export default FileAttente;
