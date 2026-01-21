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
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 transition-all duration-[800ms]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase transition-all">Ordonnances Émises</h1>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium italic">Gérez et suivez les prescriptions de vos patients.</p>
                    </div>
                    <button className="w-full sm:w-auto h-12 px-6 md:px-8 bg-primary text-white rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                        Nouvelle Ordonnance
                    </button>
                </div>

                <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-0 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest">Référence / Date</th>
                                    <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest">Patient</th>
                                    <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest">Médicaments</th>
                                    <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest">Statut</th>
                                    <th className="px-4 md:px-6 py-3 md:py-4 text-right text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {list.map((ord, i) => (
                                    <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-4 md:px-6 py-4 md:py-6 font-bold text-titles dark:text-white text-xs md:text-sm italic">{ord.id}<br /><span className="text-[9px] md:text-[10px] font-medium text-slate-400">{ord.date}</span></td>
                                        <td className="px-4 md:px-6 py-4 md:py-6 text-xs md:text-sm font-black text-titles dark:text-white uppercase tracking-tighter">{ord.patient}</td>
                                        <td className="px-4 md:px-6 py-4 md:py-6 text-[11px] md:text-xs text-slate-500 dark:text-slate-400 font-medium italic">{ord.medicines}</td>
                                        <td className="px-4 md:px-6 py-4 md:py-6">
                                            <span className={`px-2 md:px-3 py-1 bg-primary/10 text-primary rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-primary/10`}>{ord.status}</span>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 md:py-6 text-right">
                                            <div className="flex justify-end gap-2 text-slate-400">
                                                <button className="size-8 md:size-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center border border-transparent hover:border-primary/20"><span className="material-symbols-outlined text-[16px] md:text-[18px]">print</span></button>
                                                <button className="size-8 md:size-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center border border-transparent hover:border-primary/20"><span className="material-symbols-outlined text-[16px] md:text-[18px]">share</span></button>
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
