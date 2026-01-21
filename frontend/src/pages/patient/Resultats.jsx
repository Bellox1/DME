import React from 'react';
import PatientLayout from '../../components/layouts/PatientLayout';

const Resultats = () => {
    const labResults = [
        { id: 'LAB-782', type: 'Prise de Sang', lab: 'Laboratoire Central', date: '20 Jan 2026', status: 'Disponible', results: 'Normal' },
        { id: 'XRAY-102', type: 'Radiographie Thorax', lab: 'Centre Imagerie Pro', date: '12 Jan 2026', status: 'Disponible', results: 'Observation mineure' },
        { id: 'BIO-144', type: 'Analyse d\'Urine', lab: 'Laboratoire Central', date: '05 Jan 2026', status: 'En cours', results: '-' },
    ];

    return (
        <PatientLayout>
            <div className="p-8 max-w-7xl mx-auto w-full flex flex-col gap-8 transition-all duration-[800ms]">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-titles dark:text-white tracking-tight">Analyses & Examens</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Suivez vos résultats biologiques et rapports d'imagerie.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {labResults.map((res) => (
                        <div key={res.id} className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:translate-x-1 transition-all">
                            <div className="flex items-center gap-6">
                                <div className={`size-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg ${res.type.includes('Radiographie') ? 'bg-indigo-500' : 'bg-primary'
                                    }`}>
                                    <span className="material-symbols-outlined text-3xl">
                                        {res.type.includes('Radiographie') ? 'visibility' : 'biotech'}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-[13px] font-black tracking-tight text-titles dark:text-white uppercase">{res.id}</h3>
                                    <h4 className="text-lg font-black text-titles dark:text-white leading-tight">{res.type}</h4>
                                    <div className="flex items-center gap-4">
                                        <p className="text-xs text-slate-500 font-bold tracking-wide">{res.lab}</p>
                                        <span className="size-1 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                                        <p className="text-xs text-slate-500 font-bold tracking-wide">{res.date}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-12">
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${res.status === 'Disponible' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                                        }`}>
                                        {res.status}
                                    </span>
                                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{res.results}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="h-11 px-6 bg-slate-50 dark:bg-slate-800 text-titles dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black transition-all hover:bg-primary hover:text-white hover:border-primary disabled:opacity-50" disabled={res.status !== 'Disponible'}>
                                        Ouvrir le rapport
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PatientLayout>
    );
};

export default Resultats;
