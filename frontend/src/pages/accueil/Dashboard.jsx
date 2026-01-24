import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReceptionLayout from '../../components/layouts/ReceptionLayout';
import FirstLoginModal from '../../components/FirstLoginModal';
import { patientService, queueService } from '../../services';

const ReceptionDashboard = () => {
    const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);
    const [patients, setPatients] = useState([]);
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [patientsData, queueDataResponse] = await Promise.all([
                    patientService.getAllPatients(),
                    queueService.getQueue().catch(() => [])
                ]);

                const queueData = Array.isArray(queueDataResponse) ? queueDataResponse : (queueDataResponse.data || []);

                setPatients(patientsData);
                setQueue(queueData);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        // Rafraîchir toutes les 60 secondes
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleFirstLoginComplete = () => {
        localStorage.setItem('user-first-login', 'false');
        setShowFirstLoginModal(false);
    };

    const getPatientInfo = (patientId) => {
        return patients.find(p => p.id === parseInt(patientId)) || {};
    };

    // Calculate stats from patients data
    const totalPatients = patients.length;
    const kidsCount = patients.filter(p => p.type === 'Enfant').length;
    const adultsCount = patients.filter(p => p.type === 'Adulte').length;

    // Show actual queue or recent patients if queue is empty
    const displayList = queue.length > 0
        ? queue.slice(0, 5)
        : patients.slice(-5).reverse();

    return (
        <>
            {showFirstLoginModal && (
                <FirstLoginModal
                    userPhone="+229 97 00 00 00"
                    onComplete={handleFirstLoginComplete}
                />
            )}

            <ReceptionLayout>
                <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-8 transition-all duration-[800ms]">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase">
                            Bonjour 👋
                        </h1>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium italic">Prêt pour une nouvelle journée d'accueil ?</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Patients', value: loading ? '...' : totalPatients, subValue: 'Base de données', icon: 'groups', color: 'bg-primary' },
                            { label: 'Enfants', value: loading ? '...' : kidsCount, subValue: 'Comptes dépendants', icon: 'child_care', color: 'bg-blue-50' },
                            { label: 'Adultes', value: loading ? '...' : adultsCount, subValue: 'Comptes autonomes', icon: 'person', color: 'bg-amber-500' },
                            { label: 'File d\'attente', value: loading ? '...' : queue.length, subValue: 'Salle d\'attente', icon: 'hourglass_empty', color: 'bg-rose-500' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white dark:bg-[#1c2229] p-6 rounded-[2rem] border border-slate-200 dark:border-[#2d363f] shadow-sm flex flex-col gap-4 group hover:shadow-xl hover:shadow-primary/5 transition-all">
                                <div className={`size-12 rounded-2xl ${i === 1 ? 'bg-blue-500 text-white' : i === 3 ? 'bg-indigo-500 text-white' : stat.color + ' text-white'} flex items-center justify-center shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
                                    <span className="material-symbols-outlined">{stat.icon}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] mb-1">{stat.label}</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-black text-titles dark:text-white italic tracking-tighter">{stat.value}</span>
                                        <span className="text-[10px] font-bold text-slate-400 italic">{stat.subValue}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Active Queue Table */}
                        <div className="lg:col-span-8 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 md:p-8">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-lg md:text-xl font-black text-titles dark:text-white tracking-tight uppercase italic">
                                        {queue.length > 0 ? 'File d\'attente actuelle' : 'Dernières inscriptions'}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium italic">
                                        {queue.length > 0 ? 'Patients attendant une consultation' : 'Récemment ajoutés au système'}
                                    </p>
                                </div>
                                <Link to="/accueil/file-attente" className="w-full sm:w-auto h-10 px-6 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center">Gérer la file</Link>
                            </div>

                            <div className="overflow-x-auto px-4 md:px-8 pb-4 md:pb-8">
                                {loading ? (
                                    <div className="py-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                                ) : (
                                    <table className="w-full min-w-[600px]">
                                        <thead>
                                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                                <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Patient</th>
                                                <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">ID / Contact</th>
                                                <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Status</th>
                                                <th className="px-4 py-3 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Type</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                            {displayList.map((item, i) => {
                                                const patient = queue.length > 0 ? getPatientInfo(item.patient_id) : item;
                                                return (
                                                    <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="size-9 rounded-xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary font-black text-xs shrink-0 uppercase">
                                                                    {patient.nom ? patient.nom[0] : 'P'}
                                                                </div>
                                                                <div className="flex flex-col leading-none min-w-0">
                                                                    <span className="text-sm font-bold text-titles dark:text-white uppercase tracking-tighter truncate italic">{patient.nom} {patient.prenom}</span>
                                                                    <span className="text-[10px] text-slate-400 font-bold italic">{patient.tel || 'N/A'}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 italic">#{patient.id}</td>
                                                        <td className="px-4 py-4">
                                                            <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase whitespace-nowrap ${queue.length > 0 ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'
                                                                }`}>
                                                                {queue.length > 0 ? (item.statut || 'En attente') : 'Enregistré'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-right">
                                                            <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase whitespace-nowrap ${patient.type === 'Enfant' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'}`}>
                                                                {patient.type === 'Enfant' ? 'Élement dépendant' : 'Autonome'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {displayList.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="py-12 text-center text-slate-400 font-bold italic uppercase tracking-widest">
                                                        Aucune donnée disponible
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions Sidebar */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <div className="bg-primary/90 backdrop-blur-md rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                                <h4 className="text-lg font-black mb-6 relative z-10 leading-tight uppercase tracking-wider italic">Actions Rapides</h4>
                                <div className="grid grid-cols-1 gap-4 relative z-10">
                                    <Link to="/accueil/enregistrement" className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 group">
                                        <span className="material-symbols-outlined p-2 bg-white text-primary rounded-xl group-hover:scale-110 transition-transform">person_add</span>
                                        <span className="text-sm font-black tracking-tight leading-none uppercase text-left italic">Nouveau Patient</span>
                                    </Link>
                                    <Link to="/accueil/rdv" className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 group">
                                        <span className="material-symbols-outlined p-2 bg-white text-primary rounded-xl group-hover:scale-110 transition-transform">calendar_today</span>
                                        <span className="text-sm font-black tracking-tight leading-none uppercase text-left italic">Fixer un Rendez-vous</span>
                                    </Link>
                                    <Link to="/accueil/demandes-rdv" className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 group">
                                        <span className="material-symbols-outlined p-2 bg-white text-primary rounded-xl group-hover:scale-110 transition-transform">list_alt</span>
                                        <span className="text-sm font-black tracking-tight leading-none uppercase text-left italic">Demandes RDV</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Summary of Today's Revenue */}
                            <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm">
                                <h4 className="text-base font-black text-titles dark:text-white mb-6 uppercase tracking-widest leading-none italic uppercase">Récapitulatif Caisse</h4>
                                <div className="space-y-6">
                                    {[
                                        { label: 'Espèces', value: '85.000', color: 'bg-emerald-500', pct: '60%' },
                                        { label: 'Mobile Money', value: '42.500', color: 'bg-blue-500', pct: '30%' },
                                        { label: 'Assurances', value: '15.000', color: 'bg-primary', pct: '10%' },
                                    ].map((pay, i) => (
                                        <div key={i} className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center px-1">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{pay.label}</span>
                                                <span className="text-xs font-black text-titles dark:text-white italic">{pay.value} F</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className={`${pay.color} h-full transition-all duration-1000`} style={{ width: pay.pct }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ReceptionLayout>
        </>
    );
};

export default ReceptionDashboard;


