import React from 'react';
import ReceptionLayout from '../../components/layouts/ReceptionLayout';

const NotificationsReception = () => {
    const notifications = [
        { id: 1, type: 'calendar_clock', title: 'RDV Urgent', desc: 'Le patient Koffi Mensah est arrivé pour son RDV de 08:30.', time: 'À l\'instant', isUnread: true },
        { id: 2, type: 'payments', title: 'Paiement en attente', desc: 'La facture FAC-002 de Jean Dupont est en attente de validation.', time: 'Il y a 15 min', isUnread: true },
        { id: 3, type: 'person_add', title: 'Nouveau Patient', desc: 'Un nouveau dossier a été créé via la borne d\'auto-enregistrement.', time: 'Il y a 1h', isUnread: false },
    ];

    return (
        <ReceptionLayout>
            <div className="p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 transition-all duration-[800ms]">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-black text-titles dark:text-white tracking-tight">Flux de Travail</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Alertes et notifications de réception.</p>
                    </div>
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
            </div>
        </ReceptionLayout>
    );
};

export default NotificationsReception;
