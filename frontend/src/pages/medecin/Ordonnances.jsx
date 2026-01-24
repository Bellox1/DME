import React from 'react';
import DoctorLayout from '../../components/layouts/DoctorLayout';

const OrdonnancesMedecin = () => {
    const list = [
        { id: 'ORD-2026-001', patient: 'Alice Patient', date: '21/01/2026', medicines: 'Paracétamol, Amoxicilline', status: 'Signée' },
        { id: 'ORD-2026-002', patient: 'Léo Patient', date: '20/01/2026', medicines: 'Sirop toux, Vitamine C', status: 'Signée' },
        { id: 'ORD-2026-003', patient: 'Jean Dupont', date: '19/01/2026', medicines: 'Ramipril, Atorvastatine', status: 'Archivée' },
    ];

    return (
        <DoctorLayout>
            <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-primary/10 text-primary rounded-xl material-symbols-outlined text-[20px]">prescriptions</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Archives Prescription</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-titles dark:text-white tracking-tighter leading-none italic uppercase">
                            Ordonnances <span className="text-primary italic">Émises</span>
                        </h1>
                        <p className="text-base text-slate-500 dark:text-slate-400 font-medium italic">Suivez et gérez l'intégralité des prescriptions médicamenteuses délivrées.</p>
                    </div>
                    <button className="w-full md:w-auto h-14 px-10 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined text-[20px]">medical_services</span>
                        Nouvelle Ordonnance
                    </button>
                </div>

                <div className="bg-white dark:bg-[#1c2229] border border-slate-100 dark:border-[#2d363f] rounded-[3rem] p-0 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Référence / Date</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Patient Concerné</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Détail Médicamenteux</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">État</th>
                                    <th className="px-8 py-7 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {list.map((ord, i) => (
                                    <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-500">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-titles dark:text-white italic tracking-tighter mb-1">{ord.id}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[14px] text-slate-400">calendar_today</span>
                                                    <span className="text-[10px] font-bold text-slate-400 italic">{ord.date}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-black text-xs group-hover:bg-primary group-hover:text-white transition-all">
                                                    {ord.patient.charAt(0)}
                                                </div>
                                                <span className="text-sm font-black text-titles dark:text-white uppercase tracking-tighter italic">{ord.patient}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="max-w-[300px]">
                                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 italic truncate group-hover:text-titles dark:group-hover:text-white transition-colors">
                                                    {ord.medicines}
                                                </p>
                                                <span className="text-[9px] font-black text-primary uppercase tracking-widest mt-1 block opacity-0 group-hover:opacity-100 transition-opacity">Voir le détail</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${ord.status === 'Signée' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                                {ord.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                                <button className="size-11 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-primary transition-all shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[20px]">print</span>
                                                </button>
                                                <button className="size-11 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-primary transition-all shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[20px]">share</span>
                                                </button>
                                                <button className="size-11 rounded-xl bg-primary text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20">
                                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
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
        </DoctorLayout>
    );
};

export default OrdonnancesMedecin;
