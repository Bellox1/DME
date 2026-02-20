import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import api from '../../services/api';

const AdminLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await api.get('/admin/logs');
            setLogs(response.data);
        } catch (err) {
            console.error('Error fetching logs:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (isoString) => {
        if (!isoString) return '-';
        const date = new Date(isoString);
        return date.toLocaleString('fr-FR', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getLevelStyle = (level) => {
        switch (level) {
            case 'success': return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
            case 'warning': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300';
            case 'error': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
        }
    };

    return (
        <AdminLayout>
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
                <div className="mb-6 md:mb-8 text-titles dark:text-white">
                    <h1 className="text-2xl md:text-4xl font-black tracking-tight uppercase italic transition-all">Logs du Système</h1>
                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-2 italic">Suivez l'activité détaillée et les événements de sécurité de l'application.</p>
                </div>

                <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 dark:border-[#2d363f] flex items-center justify-between">
                        <h3 className="font-bold text-titles dark:text-white uppercase italic text-sm md:text-base">Journaux d'audit</h3>
                        <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Exporter en CSV</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Horodatage</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Utilisateur</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Événement</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {logs.map((log, i) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                        <td className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400">{formatTime(log.time)}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-titles dark:text-white">{log.user}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-medium">{log.action}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminLogs;
