import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import api from '../../services/api';

const AdminStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/stats');
            setStats(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError('Erreur lors du chargement des statistiques');
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('fr-FR').format(num || 0);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR').format(amount || 0) + ' FCFA';
    };

    const formatGrowth = (growth) => {
        const sign = growth >= 0 ? '+' : '';
        return `${sign}${growth}%`;
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Chargement des statistiques...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <span className="material-symbols-outlined text-6xl text-red-500">error</span>
                        <p className="text-slate-700 dark:text-slate-300 font-bold text-lg">{error}</p>
                        <button
                            onClick={fetchStats}
                            className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all"
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const primaryMetrics = [
        {
            label: 'Utilisateurs Totaux',
            value: formatNumber(stats?.users?.total),
            change: formatGrowth(stats?.users?.growth),
            color: 'bg-blue-500',
            icon: 'groups'
        },
        {
            label: 'Chiffre d\'Affaires',
            value: formatCurrency(stats?.revenue?.total),
            change: formatGrowth(stats?.revenue?.growth),
            color: 'bg-green-500',
            icon: 'payments'
        },
        {
            label: 'Consultations',
            value: formatNumber(stats?.consultations?.total),
            change: formatGrowth(stats?.consultations?.growth),
            color: 'bg-purple-500',
            icon: 'stethoscope'
        },
        {
            label: 'Taux d\'Occupation',
            value: `${stats?.occupancy_rate || 0}%`,
            change: '+3.2%',
            color: 'bg-orange-500',
            icon: 'monitoring'
        }
    ];

    const userDistribution = [
        {
            role: 'Patients',
            count: stats?.users?.patients || 0,
            percentage: stats?.users?.total > 0 ? Math.round((stats?.users?.patients / stats?.users?.total) * 100) : 0,
            color: 'bg-blue-500'
        },
        {
            role: 'Médecins',
            count: stats?.users?.medecins || 0,
            percentage: stats?.users?.total > 0 ? Math.round((stats?.users?.medecins / stats?.users?.total) * 100) : 0,
            color: 'bg-indigo-500'
        },
        {
            role: 'Accueil',
            count: stats?.users?.accueil || 0,
            percentage: stats?.users?.total > 0 ? Math.round((stats?.users?.accueil / stats?.users?.total) * 100) : 0,
            color: 'bg-amber-500'
        },
        {
            role: 'Admins',
            count: stats?.users?.admins || 0,
            percentage: stats?.users?.total > 0 ? Math.round((stats?.users?.admins / stats?.users?.total) * 100) : 0,
            color: 'bg-rose-500'
        }
    ];

    return (
        <AdminLayout>
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 transition-all duration-[800ms] animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase">Statistiques Globales</h1>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium tracking-tight">Analyse complète des performances du centre hospitalier.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button className="h-10 md:h-11 px-4 md:px-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] md:text-[20px]">calendar_today</span>
                            Derniers 30 jours
                        </button>
                        <button className="h-10 md:h-11 px-4 md:px-6 rounded-xl bg-primary text-white text-xs md:text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-[18px] md:text-[20px]">download</span>
                            Exporter le rapport
                        </button>
                    </div>
                </div>

                {/* Primary Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {primaryMetrics.map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 md:p-8 shadow-sm group hover:shadow-xl hover:shadow-primary/5 transition-all relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color}/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500`}></div>
                            <div className="flex items-center gap-4 mb-4 relative z-10">
                                <div className={`size-12 rounded-2xl ${stat.color}/10 flex items-center justify-center text-${stat.color.split('-')[1]}-500 group-hover:bg-${stat.color.split('-')[1]}-500 group-hover:text-white transition-all`}>
                                    <span className="material-symbols-outlined">{stat.icon}</span>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{stat.change}</span>
                            </div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">{stat.label}</h4>
                            <span className="text-2xl font-black text-titles dark:text-white italic tracking-tighter relative z-10">{stat.value}</span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Activity Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-10 shadow-sm">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                            <h3 className="text-lg md:text-xl font-black text-titles dark:text-white tracking-tight uppercase italic flex items-center gap-3">
                                <span className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[18px]">show_chart</span>
                                </span>
                                Activité Hospitalière
                            </h3>
                            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                                {['Semaine', 'Mois', 'Année'].map((filter) => (
                                    <button key={filter} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all ${filter === 'Mois' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <div className="h-64 md:h-80 min-w-[600px] w-full flex items-end justify-between gap-2 md:gap-4 px-4 pb-8">
                                {stats?.monthly_activity?.map((month, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                        <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-t-2xl relative overflow-hidden flex items-end" style={{ height: '100%' }}>
                                            <div
                                                className="w-full bg-primary/20 group-hover:bg-primary transition-all rounded-t-xl"
                                                style={{ height: `${month.percentage || 5}%` }}
                                            >
                                                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-titles text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {month.count}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 leading-none">
                                            {month.month}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Users Distribution */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-10 shadow-sm">
                        <h3 className="text-xl font-black text-titles dark:text-white mb-8 tracking-tight uppercase italic flex items-center gap-3">
                            <span className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-[18px]">pie_chart</span>
                            </span>
                            Répartition
                        </h3>

                        <div className="space-y-6">
                            {userDistribution.map((item, i) => (
                                <div key={i} className="space-y-2 group">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h4 className="text-sm font-bold text-titles dark:text-white tracking-tight">{item.role}</h4>
                                            <span className="text-xs text-slate-400 font-medium">{item.count} utilisateurs</span>
                                        </div>
                                        <span className="text-sm font-black text-titles dark:text-white italic">{item.percentage}%</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} transition-all duration-1000 group-hover:brightness-110`}
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-4">
                                <div className="text-2xl">⚡</div>
                                <div>
                                    <h4 className="text-xs font-black text-titles dark:text-white uppercase">Insight Clé</h4>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                        {stats?.users?.patients > 0
                                            ? `Le nombre de patients représente ${userDistribution[0].percentage}% des utilisateurs.`
                                            : 'Aucun patient enregistré pour le moment.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Recent Registrations */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-10 shadow-sm flex flex-col">
                        <h3 className="text-lg font-black text-titles dark:text-white mb-6 uppercase italic">Dernières Inscriptions</h3>
                        <div className="space-y-4">
                            {stats?.recent_users?.length > 0 ? (
                                stats.recent_users.map((user, n) => (
                                    <div key={user.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-primary/20 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                                {user.nom?.charAt(0)}{user.prenom?.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-titles dark:text-white group-hover:text-primary transition-colors">{user.nom} {user.prenom}</h4>
                                                <span className="text-[10px] text-slate-400">{user.time_ago}</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] px-2 py-1 rounded-md bg-green-50 dark:bg-green-900/30 text-green-600 font-bold uppercase">{user.role}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400 text-center py-8">Aucune inscription récente</p>
                            )}
                        </div>
                        <button className="w-full mt-6 py-3 text-xs font-black text-primary uppercase tracking-widest hover:bg-primary/5 rounded-xl transition-all">
                            Voir tout l'historique
                        </button>
                    </div>

                    {/* System Health */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-10 shadow-sm">
                        <h3 className="text-lg font-black text-titles dark:text-white mb-6 uppercase italic">Santé du Système</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'CPU Usage', value: '12%', color: 'text-green-500', icon: 'memory' },
                                { label: 'Mémoire', value: '45%', color: 'text-amber-500', icon: 'data_usage' },
                                { label: 'Disque', value: '28%', color: 'text-green-500', icon: 'storage' },
                                { label: 'Uptime', value: '99.9%', color: 'text-primary', icon: 'timer' }
                            ].map((item, i) => (
                                <div key={i} className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex flex-col items-center text-center">
                                    <span className={`material-symbols-outlined ${item.color} mb-2`}>{item.icon}</span>
                                    <span className="text-sm font-black text-titles dark:text-white">{item.value}</span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Base de données connectée</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Serveur API opérationnel</span>
                            </div>
                        </div>
                    </div>

                    {/* Critical Alerts */}
                    <div className="bg-primary text-white rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-primary/20 relative overflow-hidden group">
                        <div className="absolute -bottom-8 -right-8 size-48 bg-white/10 rounded-full group-hover:scale-125 transition-transform duration-700"></div>
                        <h3 className="text-lg font-black mb-6 uppercase italic relative z-10">Alertes Critiques</h3>
                        <div className="space-y-4 relative z-10">
                            {[
                                `${stats?.rdvs?.programmes || 0} rendez-vous programmés`,
                                `${stats?.consultations?.unpaid || 0} consultations non payées`,
                                'Système à jour'
                            ].map((alert, i) => (
                                <div key={i} className="flex gap-3 items-start bg-white/10 p-3 rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
                                    <span className="material-symbols-outlined text-sm mt-0.5">warning</span>
                                    <p className="text-[11px] font-bold leading-tight">{alert}</p>
                                </div>
                            ))}
                        </div>
                        <button className="mt-8 w-full py-3 bg-white text-primary rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all relative z-10 active:scale-95">
                            Gérer les alertes
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminStats;
