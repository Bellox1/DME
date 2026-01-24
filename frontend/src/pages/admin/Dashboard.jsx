import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layouts/AdminLayout';

const AdminDashboard = () => {
    const [user] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : { nom: 'Admin', prenom: '' };
    });

    const quickActions = [
        { title: 'Ajouter un utilisateur', icon: 'person_add', description: 'Enregistrer un nouveau compte.', path: '/admin/inscription' },
        { title: 'Gérer les rôles', icon: 'settings', description: 'Permissions et accès.', path: '/admin/parametres' },
        { title: 'Statistiques', icon: 'monitoring', description: 'Analyses globales.', path: '/admin/stats' },
        { title: 'Voir les logs', icon: 'bar_chart', description: 'Activité du système.', path: '/admin/logs' },
    ];


    const recentActivities = [
        { time: '09:00', user: 'Dr. Martin Durand', action: 'Inscription médecin', status: 'Validé' },
        { time: '09:45', user: 'Sophie Laurent', action: 'Inscription accueil', status: 'En attente' },
        { time: '10:30', user: 'Jean Dupont', action: 'Inscription patient', status: 'Validé' },
        { time: '11:15', user: 'Marie Dubois', action: 'Modification rôle', status: 'Validé' },
        { time: '14:00', user: 'Pierre Martin', action: 'Inscription médecin', status: 'En attente' },
    ];

    const pendingTasks = [
        { task: 'Validations en attente', count: 3 },
        { task: 'Révisions de permissions', count: 5 },
        { task: 'Logs à vérifier', count: 12 },
    ];

    return (
        <AdminLayout>
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 md:gap-12 transition-all duration-1000 animate-in fade-in slide-in-from-bottom-4">

                {/* Welcome Section Premium Style */}
                <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-primary to-[#35577D] p-8 md:p-12 text-white shadow-2xl shadow-primary/20">
                    <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 size-48 bg-primary/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic">Statut: Administrateur</span>
                                <span className="size-2 rounded-full bg-green-400 animate-ping"></span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none italic uppercase">
                                Bonjour, <span className="text-white/80">{user.prenom} {user.nom}</span> 👋
                            </h1>
                            <p className="text-lg text-white/70 font-medium italic max-w-md">
                                Bienvenue sur votre console de gestion. Toutes les fonctionnalités système sont à votre disposition.
                            </p>
                        </div>
                        <div className="hidden lg:flex items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-inner">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Date d'aujourd'hui</span>
                                <span className="text-xl font-black italic">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="size-12 rounded-2xl bg-white text-primary flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-[28px]">calendar_today</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {quickActions.map((item, i) => (
                        <Link key={i} to={item.path} className="flex flex-col gap-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer group border-b-4 border-b-primary">
                            <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                <span className="material-symbols-outlined text-[32px]">{item.icon}</span>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-lg font-bold mb-1 text-titles dark:text-white">{item.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Recent Activities Table */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">history</span>
                                <h3 className="text-xl font-bold tracking-tight text-titles dark:text-white">Activités récentes</h3>
                            </div>
                            <button className="text-primary text-xs font-bold hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors border border-primary/20">Voir tout</button>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[700px]">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                                            <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">Heure</th>
                                            <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">Utilisateur</th>
                                            <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">Action</th>
                                            <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">Statut</th>
                                            <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {recentActivities.map((activity, i) => (
                                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                                                <td className="px-6 py-4 text-sm font-bold text-titles dark:text-white">{activity.time}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-titles dark:text-white">{activity.user}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{activity.action}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${activity.status === 'Validé'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                                                        }`}>
                                                        {activity.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-all shadow-sm">Détails</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                    {/* Pending Tasks Widget */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-primary text-white rounded-2xl p-6 shadow-xl shadow-primary/20 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-2">
                                    <h4 className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Tâches en attente</h4>
                                    <span className="text-4xl font-black">{pendingTasks.reduce((acc, t) => acc + t.count, 0)}</span>
                                </div>
                                <span className="material-symbols-outlined text-white/30 text-4xl">assignment_late</span>
                            </div>
                            <div className="space-y-2 mt-2">
                                {pendingTasks.map((task, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-white/90">{task.task}</span>
                                        <span className="bg-white/20 px-2 py-0.5 rounded font-bold">{task.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
