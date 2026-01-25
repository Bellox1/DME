import React from 'react';
import DoctorLayout from '../../components/layouts/DoctorLayout';

const NotificationsMedecin = () => {
    const notifications = [
        { title: 'Nouveaux Résultats Labo', desc: 'Les résultats pour Alice Patient (ID: P-2026-001) sont disponibles.', time: 'Il y a 10 min', type: 'doc' },
        { title: 'Rendez-vous Urgent', desc: 'Jean Dupont vient de s\'inscrire pour une consultation urgente.', time: 'Il y a 25 min', type: 'urgent' },
        { title: 'Mise à jour Dossier', desc: 'L\'infirmier a mis à jour les constantes de Léo Patient.', time: 'Il y a 1h', type: 'update' },
    ];

    return (
        <DoctorLayout>
            <div className="p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 transition-all duration-[800ms]">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase">Notifications</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Restez informé de l'activité médicale concernant vos patients.</p>
                </div>

                <div className="space-y-4">
                    {notifications.map((n, i) => (
                        <div key={i} className={`p-6 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] shadow-sm flex items-start gap-5 transition-all hover:scale-[1.01] ${n.type === 'urgent' ? 'border-l-4 border-l-rose-500' : 'border-l-4 border-l-primary'}`}>
                            <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${n.type === 'urgent' ? 'bg-rose-100 text-rose-500' : 'bg-primary/10 text-primary'}`}>
                                <span className="material-symbols-outlined">{n.type === 'doc' ? 'lab_research' : n.type === 'urgent' ? 'error' : 'history'}</span>
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-sm font-black text-titles dark:text-white uppercase tracking-tight">{n.title}</h4>
                                    <span className="text-[10px] font-black italic text-slate-400 capitalize">{n.time}</span>
                                </div>
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">"{n.desc}"</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DoctorLayout>
    );
};

export default NotificationsMedecin;
