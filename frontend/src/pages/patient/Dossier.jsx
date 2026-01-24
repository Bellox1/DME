import React from 'react';
import PatientLayout from '../../components/layouts/PatientLayout';

const Dossier = () => {
    return (
        <PatientLayout>
            <div className="p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 transition-all duration-[800ms]">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-titles dark:text-white tracking-tight">Mon Dossier Médical</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">L'ensemble de vos données de santé centralisées.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Infos Vitales */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm">
                            <h3 className="text-lg font-black text-titles dark:text-white mb-6">Informations Vitales</h3>
                            <div className="space-y-6">
                                {[
                                    { label: 'Groupe Sanguin', value: 'O+', icon: 'bloodtype', color: 'text-red-500' },
                                    { label: 'Taille', value: '172 cm', icon: 'height', color: 'text-blue-500' },
                                    { label: 'Poids', value: '68 kg', icon: 'weight', color: 'text-green-500' },
                                    { label: 'IMC', value: '23.0 (Normal)', icon: 'speed', color: 'text-orange-500' },
                                ].map((info, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-transparent">
                                        <div className={`size-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center ${info.color} shadow-sm border border-slate-100 dark:border-slate-700`}>
                                            <span className="material-symbols-outlined text-[20px]">{info.icon}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-display">{info.label}</span>
                                            <span className="text-sm font-black text-titles dark:text-white">{info.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm">
                            <h3 className="text-lg font-black text-titles dark:text-white mb-6">Conditions & Allergies</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Asthme', 'Allergie Pénicilline', 'Lactose'].map((cond, i) => (
                                    <span key={i} className="px-5 py-2.5 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-2xl text-xs font-bold border border-red-100 dark:border-red-900/20">
                                        {cond}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Historique Médical Facette Animée */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black text-titles dark:text-white">Historique Médical</h3>
                                <button className="size-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 border border-slate-100 dark:border-slate-800">
                                    <span className="material-symbols-outlined">filter_list</span>
                                </button>
                            </div>

                            <div className="space-y-12 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-[#2d363f]">
                                {[
                                    { date: '15 Jan 2026', title: 'Consultation Cardiologie', doctor: 'Dr. Sarah Kone', desc: 'Suivi de routine. Tension normale.' },
                                    { date: '10 Nov 2025', title: 'Examen de Vue', doctor: 'Dr. Marc Dubois', desc: 'Changement de verres correcteurs.' },
                                    { date: '05 Sep 2025', title: 'Vaccination Grippe', doctor: 'Infirmier Centre A', desc: 'Rappel annuel.' },
                                ].map((hist, i) => (
                                    <div key={i} className="relative pl-14 group">
                                        <div className="absolute left-4 top-0 size-4 bg-white dark:bg-[#1c2229] border-4 border-primary rounded-full z-10" />
                                        <div className="flex flex-col gap-2 p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900/40 border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-800 transition-all">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-[13px] font-black text-titles dark:text-white">{hist.title}</h4>
                                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{hist.date}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{hist.doctor}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium leading-relaxed">{hist.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
};

export default Dossier;
