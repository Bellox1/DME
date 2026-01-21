import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReceptionLayout from '../../components/layouts/ReceptionLayout';

const GestionRDV = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const rdv = [
        { time: '08:30', patient: 'Alice Patient', doctor: 'Dr. Sarah Kone', status: 'Confirmé', color: 'bg-green-100 text-green-600' },
        { time: '09:15', patient: 'Jean Dupont', doctor: 'Dr. Marc Dubois', status: 'En attente', color: 'bg-amber-100 text-amber-600' },
        { time: '10:00', patient: 'Koffi Mensah', doctor: 'Dr. Sarah Kone', status: 'Annulé', color: 'bg-red-100 text-red-600' },
        { time: '11:00', patient: 'Sika Yao', doctor: 'Dr. Marc Dubois', status: 'Arrivée', color: 'bg-primary/10 text-primary' },
    ];

    return (
        <ReceptionLayout>
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 transition-all duration-[800ms]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white tracking-tight leading-none">Gestion des Rendez-vous</h1>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium">Planifiez et gérez les consultations du jour.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full md:w-auto h-12 px-6 md:px-8 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center"
                    >
                        Nouveau RDV
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                    {/* Calendar / Day View */}
                    <div className="lg:col-span-8 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
                            <h3 className="text-lg md:text-xl font-black text-titles dark:text-white">Planning d'aujourd'hui</h3>
                            <div className="flex items-center gap-2">
                                <button className="size-9 md:size-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition-all">
                                    <span className="material-symbols-outlined text-[18px] md:text-[20px]">chevron_left</span>
                                </button>
                                <span className="text-xs md:text-sm font-black text-titles dark:text-white px-3 md:px-4 whitespace-nowrap">Mercredi, 21 Janvier</span>
                                <button className="size-9 md:size-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition-all">
                                    <span className="material-symbols-outlined text-[18px] md:text-[20px]">chevron_right</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3 md:space-y-4">
                            {rdv.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 md:gap-6 p-3 md:p-5 rounded-xl md:rounded-2xl border border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group">
                                    <div className="flex flex-col items-center justify-center min-w-[50px] md:min-w-[60px] border-r border-slate-100 dark:border-slate-800 pr-3 md:pr-6">
                                        <span className="text-xs md:text-sm font-black text-titles dark:text-white">{item.time}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs md:text-sm font-black text-titles dark:text-white uppercase tracking-tighter truncate">{item.patient}</h4>
                                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 italic truncate">{item.doctor}</p>
                                    </div>
                                    <span className={`px-2 md:px-4 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase whitespace-nowrap ${item.color}`}>
                                        {item.status}
                                    </span>
                                    <span className="material-symbols-outlined text-[20px] text-slate-300 group-hover:text-primary transition-colors hidden sm:block">more_vert</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Doctors Availability Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] p-8 shadow-sm">
                            <h3 className="text-base font-black text-titles dark:text-white mb-6 uppercase tracking-widest leading-none">Disponibilité Médecins</h3>
                            <div className="space-y-6">
                                {[
                                    { name: 'Dr. Sarah Kone', specialty: 'Cardiologue', status: 'En consultation', color: 'bg-amber-500' },
                                    { name: 'Dr. Marc Dubois', specialty: 'Généraliste', status: 'Libre', color: 'bg-green-500' },
                                    { name: 'Dr. Amine Tazi', specialty: 'Pédiatre', status: 'Absent', color: 'bg-slate-300' },
                                ].map((doc, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="size-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary font-black text-xs">
                                                {doc.name.split(' ')[1].charAt(0)}
                                            </div>
                                            <div className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white dark:border-[#1c2229] ${doc.color}`}></div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-black text-titles dark:text-white leading-none mb-1">{doc.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{doc.specialty}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Nouveau RDV */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white dark:bg-[#1c2229] w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined">calendar_add_on</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-titles dark:text-white tracking-tight uppercase">Programmer un Rendez-vous</h3>
                                    <p className="text-xs text-slate-500 font-medium italic">Saisie des informations de consultation</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="size-10 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Sélectionner Patient</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">person_search</span>
                                        <input type="text" placeholder="Nom ou ID Patient" className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl pl-12 pr-5 text-sm font-bold text-titles dark:text-white transition-all outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Médecin / Spécialité</label>
                                    <select className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none appearance-none cursor-pointer">
                                        <option>Dr. Sarah Kone (Cardiologue)</option>
                                        <option>Dr. Marc Dubois (Généraliste)</option>
                                        <option>Dr. Amine Tazi (Pédiatre)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Date</label>
                                    <input type="date" className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Heure</label>
                                    <input type="time" className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Motif de consultation (Optionnel)</label>
                                <textarea rows="3" placeholder="Description brève..." className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl p-5 text-sm font-bold text-titles dark:text-white transition-all outline-none resize-none"></textarea>
                            </div>

                            <button onClick={() => setIsModalOpen(false)} className="w-full h-14 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4">
                                Confirmer le Rendez-vous
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ReceptionLayout>
    );
};

export default GestionRDV;
