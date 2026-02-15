import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import api from '../../services/api';

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const getNotifMeta = (action) => {
        const lower = (action || '').toLowerCase();
        if (lower.includes('inscription') || lower.includes('créé') || lower.includes('creation') || lower.includes('ajout')) {
            return { icon: 'person_add', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20', type: 'user' };
        }
        if (lower.includes('supprim') || lower.includes('delete')) {
            return { icon: 'delete', color: 'text-red-500 bg-red-50 dark:bg-red-900/20', type: 'security' };
        }
        if (lower.includes('modifi') || lower.includes('update') || lower.includes('mis à jour') || lower.includes('mise a jour')) {
            return { icon: 'edit', color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20', type: 'update' };
        }
        if (lower.includes('connexion') || lower.includes('login') || lower.includes('auth') || lower.includes('mot de passe')) {
            return { icon: 'gpp_maybe', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20', type: 'security' };
        }
        if (lower.includes('rendez-vous') || lower.includes('rdv') || lower.includes('consultation')) {
            return { icon: 'event', color: 'text-green-500 bg-green-50 dark:bg-green-900/20', type: 'medical' };
        }
        return { icon: 'notifications', color: 'text-slate-500 bg-slate-50 dark:bg-slate-800', type: 'system' };
    };

    const formatTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMin = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMin < 1) return "À l'instant";
        if (diffMin < 60) return `Il y a ${diffMin} min`;
        if (diffHours < 24) return `Il y a ${diffHours}h`;
        if (diffDays < 7) return `Il y a ${diffDays}j`;
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/logs');
            const logs = (response.data || []).map((log, index) => {
                const meta = getNotifMeta(log.action);
                return {
                    id: log.id || index,
                    title: log.user || 'Système',
                    description: log.action || 'Action système',
                    time: formatTime(log.time),
                    unread: index < 3,
                    ...meta
                };
            });
            setNotifications(logs);
        } catch (error) {
            console.error('Erreur chargement notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 transition-all duration-[800ms]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black text-titles dark:text-white tracking-tight">Notifications</h1>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-2">Restez informé des activités récentes sur votre plateforme.</p>
                    </div>
                    <button onClick={fetchNotifications} className="text-sm font-bold text-primary hover:underline pb-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">refresh</span>
                        Actualiser
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-medium text-sm">Chargement des notifications...</p>
                        </div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">notifications_off</span>
                        <p className="text-slate-500 dark:text-slate-400 font-bold">Aucune notification pour le moment</p>
                        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Les activités du système apparaîtront ici.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`group relative p-5 rounded-3xl border transition-all duration-300 flex items-start gap-5 cursor-pointer hover:shadow-lg hover:translate-x-1 ${notif.unread
                                    ? 'bg-white dark:bg-[#1c2229] border-primary/20 shadow-sm'
                                    : 'bg-slate-50/50 dark:bg-slate-900/20 border-transparent'
                                    }`}
                            >
                                {/* Unread Indicator */}
                                {notif.unread && (
                                    <div className="absolute top-6 right-6 size-2.5 bg-primary rounded-full shadow-sm animate-pulse"></div>
                                )}

                                {/* Icon */}
                                <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${notif.color}`}>
                                    <span className="material-symbols-outlined text-[26px]">{notif.icon}</span>
                                </div>

                                {/* Content */}
                                <div className="flex flex-col gap-1 pr-6">
                                    <h3 className={`text-base font-bold transition-colors ${notif.unread ? 'text-titles dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {notif.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {notif.description}
                                    </p>
                                    <span className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                                        {notif.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminNotifications;
