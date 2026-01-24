import React, { useState, useEffect } from 'react';
import ReceptionLayout from '../../components/layouts/ReceptionLayout';
import { queueService, patientService } from '../../services';

const FileAttente = () => {
    const [queue, setQueue] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [queueDataResponse, patientsData] = await Promise.all([
                    queueService.getQueue(),
                    patientService.getAllPatients()
                ]);

                // Gérer le format de réponse Laravel {success: true, data: [...]}
                const queueData = Array.isArray(queueDataResponse) ? queueDataResponse : (queueDataResponse.data || []);

                setQueue(queueData);
                setPatients(patientsData);
            } catch (err) {
                console.error('Erreur lors du chargement de la file d\'attente:', err);
                setError('Impossible de charger la file d\'attente.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Optionnel : Rafraîchissement automatique toutes les 30 secondes
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const getPatientName = (patientId) => {
        const patient = patients.find(p => p.id === parseInt(patientId));
        return patient ? `${patient.nom} ${patient.prenom}` : `Patient #${patientId}`;
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await queueService.updateRdvStatus(id, status);
            // Rafraîchir la liste
            const queueDataResponse = await queueService.getQueue();
            const queueData = Array.isArray(queueDataResponse) ? queueDataResponse : (queueDataResponse.data || []);
            setQueue(queueData);
        } catch (err) {
            console.error('Erreur lors de la mise à jour du statut:', err);
        }
    };

    const handleRemove = async (id) => {
        if (window.confirm('Voulez-vous vraiment retirer ce patient de la file d\'attente ?')) {
            try {
                await queueService.removeFromQueue(id);
                setQueue(queue.filter(item => item.id !== id));
            } catch (err) {
                console.error('Erreur lors du retrait de la file:', err);
            }
        }
    };

    if (loading && queue.length === 0) {
        return (
            <ReceptionLayout>
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
            </ReceptionLayout>
        );
    }

    return (
        <ReceptionLayout>
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 transition-all duration-[800ms]">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase">
                        Gestion de la File d'attente
                    </h1>
                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium italic">
                        Optimisez le flux des patients en temps réel.
                    </p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 italic">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Active Queue Control */}
                    <div className="lg:col-span-12 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-6 md:p-8 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Ticket / ID</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Patient</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Service / Type</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Priorité / Statut</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {queue.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-bold italic">
                                                Aucun patient dans la file d'attente actuellement.
                                            </td>
                                        </tr>
                                    ) : (
                                        queue.map((row) => (
                                            <tr key={row.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-6 font-black text-titles dark:text-white italic">
                                                    {row.ticket || `#${row.id}`}
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex flex-col leading-none">
                                                        <span className="text-sm font-black text-titles dark:text-white uppercase tracking-tighter mb-1">
                                                            {getPatientName(row.patient_id)}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-bold">
                                                            Arrivé à {new Date(row.created_at || row.date_rdv).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                                                    {row.type || 'Consultation'}
                                                </td>
                                                <td className="px-6 py-6">
                                                    <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase ${row.statut === 'urgent' ? 'bg-red-100 text-red-600' :
                                                        row.statut === 'en_cours' ? 'bg-primary/10 text-primary' :
                                                            'bg-blue-100 text-blue-600'
                                                        }`}>
                                                        {row.statut || 'En attente'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6 text-right">
                                                    <div className="flex justify-end gap-3">
                                                        {row.statut !== 'en_cours' && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(row.id, 'en_cours')}
                                                                className="h-9 px-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-sm shadow-primary/20"
                                                            >
                                                                Appeler
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleRemove(row.id)}
                                                            className="size-9 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center border border-slate-100 dark:border-slate-700"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">cancel</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </ReceptionLayout>
    );
};

export default FileAttente;

