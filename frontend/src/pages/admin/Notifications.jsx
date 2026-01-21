import React from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';

const AdminNotifications = () => {
    const notifications = [
        {
            id: 1,
            title: 'Nouvelle inscription médecin',
            description: 'Le Dr. Sarah Kone vient de s\'inscrire sur la plateforme.',
            time: 'Il y a 5 min',
            type: 'user',
            unread: true,
            icon: 'person_add',
            color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
        },
        {
            id: 2,
            title: 'Alerte Sécurité',
            description: 'Plusieurs tentatives de connexion échouées détectées sur l\'IP 192.168.1.45',
            time: 'Il y a 1h',
            type: 'security',
            unread: true,
            icon: 'gpp_maybe',
            color: 'text-red-500 bg-red-50 dark:bg-red-900/20'
        },
        {
            id: 3,
            title: 'Maintenance Système',
            description: 'Une mise à jour du serveur est prévue pour ce soir à 23h00.',
            time: 'Il y a 3h',
            type: 'system',
            unread: false,
            icon: 'settings_suggest',
            color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20'
        },
        {
            id: 4,
            title: 'Rapport hebdomadaire disponible',
            description: 'Le résumé des activités de la semaine dernière est prêt à être consulté.',
            time: 'Hier, 18:30',
            type: 'report',
            unread: false,
            icon: 'assessment',
            color: 'text-green-500 bg-green-50 dark:bg-green-900/20'
        }
    ];

    return (
        <AdminLayout>
            <div className="p-8 max-w-4xl mx-auto w-full flex flex-col gap-8 transition-all duration-[800ms]">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-titles dark:text-white tracking-tight">Notifications</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Restez informé des activités récentes sur votre plateforme.</p>
                    </div>
                    <button className="text-sm font-bold text-primary hover:underline pb-1">Tout marquer comme lu</button>
                </div>

                <div className="flex flex-col gap-3">
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`group relative p-5 rounded-3xl border transition-all duration-300 flex items-start gap-5 cursor-pointer hover:shadow-lg hover:translate-x-1 ${notif.unread
                                    ? 'bg-white dark:bg-[#1c2229] border-primary/20 shadow-sm'
                                    : 'bg-slate-50/50 dark:bg-slate-900/20 border-transparent grayscale-[0.5]'
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

                {/* Pagination / Load More */}
                <div className="flex justify-center mt-4">
                    <button className="px-8 py-3 rounded-2xl bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] text-sm font-bold text-titles dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                        Charger les notifications plus anciennes
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminNotifications;
