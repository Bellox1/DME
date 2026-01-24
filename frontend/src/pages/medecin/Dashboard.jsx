import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DoctorLayout from '../../components/layouts/DoctorLayout';
import FirstLoginModal from '../../components/FirstLoginModal';
import { queueService, rdvService, patientService } from '../../services';

const DoctorDashboard = () => {
    const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);
    const [queue, setQueue] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        consultations: 0,
        waiting: 0,
        urgent: 0,
        tomorrow: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Dans un cas réel, on filtrerait par l'ID du médecin connecté
                const [queueData, patientsData] = await Promise.all([
                    queueService.getQueue(),
                    patientService.getAllPatients()
                ]);

                setQueue(queueData.slice(0, 5)); // Top 5
                setPatients(patientsData);

                // Calculer quelques stats basiques
                setStats({
                    consultations: queueData.filter(q => q.statut === 'termine').length,
                    waiting: queueData.filter(q => q.statut !== 'termine').length,
                    urgent: queueData.filter(q => q.statut === 'urgent').length,
                    tomorrow: 0 // Nécessiterait un appel à rdvService.getMedecinRdvs pour demain
                });

            } catch (err) {
                console.error('Erreur tableau de bord médecin:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getPatientName = (patientId) => {
        const patient = patients.find(p => p.id === parseInt(patientId));
        return patient ? `${patient.nom} ${patient.prenom}` : `Patient #${patientId}`;
    };

    const getPatientType = (patientId) => {
        const patient = patients.find(p => p.id === parseInt(patientId));
        return patient ? patient.genre : 'Standard';
    };

    const handleFirstLoginComplete = () => {
        localStorage.setItem('user-first-login', 'false');
        setShowFirstLoginModal(false);
    };

    return (
        <>
            {showFirstLoginModal && (
                <FirstLoginModal
                    userPhone="+229 90 00 00 00"
                    onComplete={handleFirstLoginComplete}
                />
            )}

            <DoctorLayout>
                <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 md:gap-12 transition-all duration-1000 animate-in fade-in slide-in-from-bottom-4">

                    {/* Welcome Section */}
                    <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-[#2c3e50] to-[#4ca1af] p-8 md:p-12 text-white shadow-2xl shadow-primary/20">
                        <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 size-48 bg-primary/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic">Statut: En service</span>
                                    <span className="size-2 rounded-full bg-green-400 animate-ping"></span>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none italic uppercase">
                                    Bonjour, <span className="text-white/80">Dr.</span> 👋
                                </h1>
                                <p className="text-lg text-white/70 font-medium italic max-w-md">
                                    Votre planning est prêt. Vous avez <span className="text-white font-bold underline decoration-white/30">{stats.waiting} patients</span> qui attendent en salle de consultation.
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

                    {/* Stats Grid - Enhanced */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {[
                            { label: 'Consultations', value: stats.consultations, subValue: 'terminées aujourd\'hui', icon: 'stethoscope', color: 'bg-primary' },
                            { label: 'En attente', value: stats.waiting, subValue: 'patients en file', icon: 'groups', color: 'bg-[#34495e]' },
                            { label: 'Urgences', value: stats.urgent, subValue: 'cas prioritaires', icon: 'notification_important', color: 'bg-rose-500' },
                            { label: 'Prochain RDV', value: stats.tomorrow, subValue: 'planifiés demain', icon: 'event', color: 'bg-amber-500' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white dark:bg-[#1c2229] p-8 rounded-[2.5rem] border border-slate-100 dark:border-[#2d363f] shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group flex flex-col justify-between h-48 relative overflow-hidden">
                                <div className="absolute top-0 right-0 size-32 bg-slate-50 dark:bg-slate-800/50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

                                <div className="relative z-10 flex justify-between items-start">
                                    <div className={`size-14 rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-xl shadow-black/5 group-hover:rotate-12 transition-all duration-500`}>
                                        <span className="material-symbols-outlined text-[28px]">{stat.icon}</span>
                                    </div>
                                    <span className="text-4xl font-black text-titles dark:text-white italic tracking-tighter tabular-nums drop-shadow-sm">
                                        {stat.value.toString().padStart(2, '0')}
                                    </span>
                                </div>

                                <div className="relative z-10">
                                    <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1 block">{stat.label}</span>
                                    <span className="text-[10px] font-bold text-slate-500 italic uppercase opacity-60">{stat.subValue}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
                        {/* Active Consultation Queue - Enhanced */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-white dark:bg-[#1c2229] border border-slate-201 dark:border-[#2d363f] rounded-[3rem] p-8 md:p-10 shadow-sm relative overflow-hidden h-full">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-2xl font-black text-titles dark:text-white tracking-tight uppercase italic flex items-center gap-3">
                                            <span className="size-3 rounded-full bg-primary flex animate-pulse"></span>
                                            Prochains Patients
                                        </h3>
                                        <p className="text-sm text-slate-500 font-medium italic">File d'attente synchronisée en temps réel</p>
                                    </div>
                                    <Link to="/medecin/agenda" className="group flex items-center gap-3 px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300">
                                        Accéder à l'agenda
                                        <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </Link>
                                </div>

                                {loading ? (
                                    <div className="py-24 text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                        <p className="text-slate-400 font-bold italic uppercase tracking-widest text-[10px]">Chargement des données...</p>
                                    </div>
                                ) : queue.length === 0 ? (
                                    <div className="py-24 text-center bg-slate-50/50 dark:bg-slate-900/40 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                                        <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">person_off</span>
                                        <p className="text-slate-400 font-bold italic uppercase tracking-widest">Aucun patient en file d'attente</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {queue.map((row, i) => (
                                            <div key={i} className="group relative flex flex-col sm:flex-row items-center justify-between p-6 bg-white dark:bg-[#1e252d] border border-slate-50 dark:border-slate-800 rounded-[2.5rem] hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:border-primary/20">
                                                <div className="flex items-center gap-6 flex-1 min-w-0">
                                                    <div className="relative">
                                                        <div className="size-16 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-primary font-black text-xl shadow-inner group-hover:scale-105 transition-transform">
                                                            {getPatientName(row.patient_id).charAt(0)}
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-white dark:bg-[#1c2229] flex items-center justify-center shadow-md">
                                                            <span className="material-symbols-outlined text-[14px] text-green-500 font-bold">check_circle</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-lg font-black text-titles dark:text-white uppercase tracking-tighter italic truncate">{getPatientName(row.patient_id)}</span>
                                                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${row.statut === 'urgent' ? 'bg-rose-100 text-rose-600' : 'bg-primary/10 text-primary'}`}>
                                                                {row.statut || 'En attente'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID #{row.patient_id}</span>
                                                            <span className="size-1 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                                                            <span className="text-[10px] font-bold text-slate-500 italic uppercase">{row.type || 'Consultation Standard'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 mt-6 sm:mt-0 w-full sm:w-auto">
                                                    <div className="hidden md:flex flex-col items-end mr-4">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Arrivée</span>
                                                        <span className="text-xs font-bold text-titles dark:text-white italic">09:45</span>
                                                    </div>
                                                    <Link
                                                        to={`/medecin/consultations?patient=${row.patient_id}`}
                                                        className="flex-1 sm:flex-none h-14 px-10 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                                                    >
                                                        Consulter
                                                        <span className="material-symbols-outlined text-[18px]">stethoscope</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar - Enhanced */}
                        <div className="lg:col-span-4 flex flex-col gap-8">
                            {/* Action Cards */}
                            <div className="bg-primary dark:bg-primary/90 rounded-[3rem] p-10 text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 size-48 bg-white/20 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-white/30 transition-all duration-700"></div>
                                <h4 className="text-xl font-black mb-8 relative z-10 uppercase tracking-wider italic flex items-center justify-between">
                                    Outils Professionnels
                                    <span className="material-symbols-outlined text-white">dynamic_form</span>
                                </h4>
                                <div className="space-y-4 relative z-10">
                                    {[
                                        { to: "/medecin/patients", label: "Dossiers Patients", icon: "person_search", sub: "Historique & Antécédents" },
                                        { to: "/medecin/ordonnances", label: "Nouvelle Ordonnance", icon: "prescriptions", sub: "Édition rapide (PDF)" },
                                        { to: "/medecin/resultats", label: "Analyses & Labo", icon: "lab_research", sub: "Derniers résultats" },
                                    ].map((action, i) => (
                                        <Link key={i} to={action.to} className="flex items-center gap-5 p-5 bg-white/10 hover:bg-white/20 rounded-[2rem] transition-all border border-white/10 group/link">
                                            <div className="size-12 rounded-2xl bg-white text-primary flex items-center justify-center group-hover/link:scale-110 group-hover/link:rotate-6 transition-all shadow-lg">
                                                <span className="material-symbols-outlined text-[24px]">{action.icon}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black tracking-widest uppercase italic">{action.label}</span>
                                                <span className="text-[9px] font-bold text-white/60 uppercase tracking-tighter">{action.sub}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Notes / Reminders - Enhanced */}
                            <div className="bg-white dark:bg-[#1c2229] border border-slate-100 dark:border-[#2d363f] rounded-[3rem] p-10 shadow-sm flex-1">
                                <div className="flex items-center justify-between mb-8">
                                    <h4 className="text-base font-black text-titles dark:text-white uppercase tracking-widest italic leading-none">Rappels</h4>
                                    <button className="size-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    {[
                                        { text: "Vérifier les résultats de Mme. Diallo", time: "Dans 15 min", type: "Rappel" },
                                        { text: "Réunion d'équipe hebdomadaire", time: "14:30", type: "Urgent" },
                                        { text: "Appeler pharmacie centrale", time: "Avant 17h", type: "Rappel" },
                                    ].map((note, i) => (
                                        <div key={i} className="group flex gap-5 animate-in fade-in slide-in-from-right-4" style={{ animationDelay: `${i * 100}ms` }}>
                                            <div className="flex flex-col items-center gap-2">
                                                <div className={`size-3 rounded-full mt-1.5 ${note.type === 'Urgent' ? 'bg-rose-500' : 'bg-primary'} shadow-sm shadow-black/10`}></div>
                                                <div className="w-[1px] flex-1 bg-slate-100 dark:bg-slate-800"></div>
                                            </div>
                                            <div className="pb-6">
                                                <p className="text-xs font-bold text-titles dark:text-white mb-2 italic tracking-tight leading-relaxed group-hover:text-primary transition-colors">
                                                    {note.text}
                                                </p>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{note.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DoctorLayout>
        </>
    );
};

export default DoctorDashboard;


