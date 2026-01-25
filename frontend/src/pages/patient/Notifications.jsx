import React from 'react';
import PatientLayout from '../../components/layouts/PatientLayout';

const Notifications = () => {
    const notifications = [
        { id: 1, type: 'calendar_month', title: 'Rappel de rendez-vous', desc: 'Votre consultation avec Dr. Sarah Kone est demain à 10:00.', time: 'Il y a 2h', isUnread: true },
        { id: 2, type: 'prescriptions', title: 'Nouvelle ordonnance', desc: 'Dr. Marc Dubois a ajouté une prescription à votre dossier.', time: 'Il y a 5h', isUnread: true },
        { id: 3, type: 'lab_research', title: 'Résultats disponibles', desc: 'Vos analyses de sang du 20/01 sont prêtes.', time: 'Hier', isUnread: false },
        { id: 4, type: 'info', title: 'Mise à jour système', desc: 'La plateforme DME a été mise à jour pour inclure de nouvelles fonctionnalités.', time: 'Il y a 2 jours', isUnread: false },
    ];

    return (
        <PatientLayout>
            <div className="p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 transition-all duration-[800ms]">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-black text-titles dark:text-white tracking-tight">Notifications</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Restez informé de votre suivi médical.</p>
                    </div>
                    <button className="text-xs font-black text-primary hover:underline uppercase tracking-widest">Tout marquer comme lu</button>
                </div>

                <div className="space-y-4">
                    {notifications.map((n) => (
                        <div key={n.id} className={`p-6 rounded-[2rem] border transition-all flex gap-6 items-start ${n.isUnread
                            ? 'bg-white dark:bg-[#1c2229] border-primary/20 shadow-lg shadow-primary/5'
                            : 'bg-slate-50/50 dark:bg-slate-900/30 border-transparent text-slate-500'
                            }`}>
                            <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${n.isUnread ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                                }`}>
                                <span className="material-symbols-outlined text-[24px]">{n.type}</span>
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                                <div className="flex justify-between items-start">
                                    <h3 className={`text-base font-black ${n.isUnread ? 'text-titles dark:text-white' : 'text-slate-500'}`}>
                                        {n.title}
                                    </h3>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{n.time}</span>
                                </div>
                                <p className={`text-sm ${n.isUnread ? 'text-slate-600 dark:text-slate-400 font-medium' : 'text-slate-400 font-medium'}`}>
                                    {n.desc}
                                </p>
                            </div>
                            {n.isUnread && <div className="size-2.5 rounded-full bg-primary mt-2"></div>}
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-6">
                    <button className="h-12 px-8 rounded-2xl bg-slate-100 dark:bg-slate-800 text-titles dark:text-white text-xs font-black hover:bg-slate-200 transition-all border border-slate-200 dark:border-slate-700">
                        Charger les notifications plus anciennes
                    </button>
                </div>
            </div>
        </PatientLayout>
    );
};

export default Notifications;
