import React from 'react';
import PatientLayout from '../../components/layouts/PatientLayout';

const Ordonnances = () => {
    const ordonnances = [
        { id: 'ORD-2026-001', doctor: 'Dr. Sarah Kone', date: '15 Jan 2026', medicines: 3, status: 'Active' },
        { id: 'ORD-2026-002', doctor: 'Dr. Marc Dubois', date: '02 Jan 2026', medicines: 2, status: 'Expirée' },
        { id: 'ORD-2025-098', doctor: 'Dr. Sarah Kone', date: '15 Déc 2025', medicines: 5, status: 'Expirée' },
    ];

    return (
        <PatientLayout>
            <div className="p-8 max-w-7xl mx-auto w-full flex flex-col gap-8 transition-all duration-[800ms]">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-titles dark:text-white tracking-tight">Mes Ordonnances</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Consultez et téléchargez vos prescriptions médicales.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ordonnances.map((ord) => (
                        <div key={ord.id} className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-3xl">prescriptions</span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${ord.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {ord.status}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1 mb-6">
                                <h3 className="text-lg font-black text-titles dark:text-white">{ord.id}</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{ord.doctor}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-transparent">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                                    <p className="text-sm font-bold text-titles dark:text-white">{ord.date}</p>
                                </div>
                                <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-transparent">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Médicaments</p>
                                    <p className="text-sm font-bold text-titles dark:text-white">{ord.medicines}</p>
                                </div>
                            </div>

                            <button className="w-full h-12 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-xs hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">download</span>
                                Télécharger PDF
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </PatientLayout>
    );
};

export default Ordonnances;
