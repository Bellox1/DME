import React, { useState, useEffect } from 'react';
import DoctorLayout from '../../components/layouts/DoctorLayout';
import medecinService from '../../services/medecin/medecinService';

const NotificationsMedecin = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await medecinService.getNotifications();
            setNotifications(data);
        } catch (err) {
            console.error('Erreur lors du chargement des notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await medecinService.markNotificationAsRead(id);
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error('Erreur lors du marquage de la notification:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await medecinService.markAllNotificationsAsRead();
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error('Erreur lors du marquage de toutes les notifications:', err);
        }
    };

    return (
        <DoctorLayout>
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 transition-all duration-[800ms]">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase">Notifications</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Restez informé de l'activité médicale concernant vos patients.</p>
                    </div>
                    {notifications.some(n => !n.isRead) && (
                        <button
                            onClick={markAllAsRead}
                            className="px-6 py-2.5 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-wider hover:bg-primary hover:text-white transition-all active:scale-95"
                        >
                            Tout marquer comme lu
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="flex flex-col gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded-[2rem] animate-pulse"></div>
                            ))}
                        </div>
                    ) : notifications.length > 0 ? (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => !n.isRead && markAsRead(n.id)}
                                className={`p-6 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] shadow-sm flex items-start gap-5 transition-all hover:scale-[1.01] cursor-pointer relative overflow-hidden ${!n.isRead
                                    ? (n.type === 'urgent' ? 'border-l-4 border-l-rose-500 bg-rose-50/10' : n.type === 'transfert' ? 'border-l-4 border-l-amber-500 bg-amber-50/10' : 'border-l-4 border-l-primary bg-primary/5')
                                    : 'opacity-70 grayscale-[0.5]'
                                    }`}
                            >
                                <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${n.type === 'urgent' ? 'bg-rose-100 text-rose-500' : n.type === 'transfert' ? 'bg-amber-100 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                                    <span className="material-symbols-outlined">{n.type === 'doc' ? 'lab_research' : n.type === 'urgent' ? 'error' : n.type === 'transfert' ? 'move_to_inbox' : 'history'}</span>
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-black text-titles dark:text-white uppercase tracking-tight flex items-center gap-2">
                                            {n.title}
                                            {!n.isRead && <span className="size-2 rounded-full bg-primary animate-pulse"></span>}
                                        </h4>
                                        <span className="text-[10px] font-black italic text-slate-400 capitalize">{n.time}</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">"{n.desc}"</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white dark:bg-[#1c2229] rounded-[2rem] border border-dashed border-slate-300 dark:border-slate-700">
                            <span className="material-symbols-outlined text-6xl text-slate-300">notifications_off</span>
                            <p className="text-slate-400 font-bold italic uppercase tracking-widest text-sm">Aucune notification pour le moment</p>
                        </div>
                    )}
                </div>
            </div>
        </DoctorLayout>
    );
};

export default NotificationsMedecin;
