import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PatientLayout from '../../components/layouts/PatientLayout';
import patientService from '../../services/patient/patientService';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [demandeForm, setDemandeForm] = useState({ type: 'modification_profil', objet: '', description: '' });
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchStats = async (patientId = null) => {
            try {
                setLoading(true);
                const data = await patientService.getDashboardStats(patientId);
                setStats(data);
            } catch (error) {
                console.error("Erreur chargement dashboard", error);
            } finally {
                setLoading(false);
            }
        };

        // Charger le profil actif au montage
        const savedProfile = localStorage.getItem('active-patient-profile');
        const activeId = savedProfile ? JSON.parse(savedProfile).id : null;
        fetchStats(activeId);

        // Écouter les changements de profil depuis le Layout
        const handleProfileChange = (event) => {
            const newProfile = event.detail;
            fetchStats(newProfile.id);
        };

        window.addEventListener('patientProfileChanged', handleProfileChange);
        return () => window.removeEventListener('patientProfileChanged', handleProfileChange);
    }, []);

    const handleDemandeSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccessMessage('');
        try {
            await patientService.createDemande(demandeForm);
            setSuccessMessage('Demande envoyée avec succès !');
            setDemandeForm({ type: 'modification_profil', objet: '', description: '' });
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (error) {
            console.error("Erreur lors de l'envoi de la demande", error);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusColor = (statut) => {
        const s = statut?.toLowerCase();
        if (['approuvé', 'terminé', 'passé'].includes(s)) return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
        if (['rejeté', 'annulé'].includes(s)) return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
        if (['programmé', 'en_attente'].includes(s)) return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    };

    if (loading) {
        return (
            <PatientLayout>
                <div className="flex h-full items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </PatientLayout>
        );
    }

    const { prochain_rdv, stats: kpi, activites_recentes, chart_data } = stats || {};
    const firstName = kpi?.nom_principal || 'Patient';

    return (
        <PatientLayout>
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 md:gap-12 transition-all duration-[800ms]">
                {/* Welcome Section Premium Style */}
                <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-primary to-secondary p-8 md:p-12 text-white shadow-2xl shadow-primary/20">
                    <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 size-48 bg-primary/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic">Espace Patient</span>
                                <span className="size-2 rounded-full bg-green-400 animate-ping"></span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none italic uppercase">
                                Bonjour, <span className="text-secondary">{firstName}</span> 👋
                            </h1>
                            <p className="text-lg text-white/70 font-medium italic max-w-md">
                                Content de vous revoir. Vous gérez actuellement {kpi?.total_dossiers_geres || 0} dossier(s) médical(aux).
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Stat Cards */}
                    {[
                        {
                            label: 'Prochain RDV',
                            value: prochain_rdv ? formatDate(prochain_rdv.dateH_rdv) : 'Aucun',
                            sub: prochain_rdv ? (prochain_rdv.patient_nom ? `${formatTime(prochain_rdv.dateH_rdv)} (${prochain_rdv.patient_nom})` : formatTime(prochain_rdv.dateH_rdv)) : '',
                            icon: 'event',
                            color: 'bg-secondary'
                        },
                        { label: 'Ordonnances actives', value: kpi?.ordonnances_actives || 0, icon: 'prescriptions', color: 'bg-primary' },
                        { label: 'Dossiers gérés', value: kpi?.total_dossiers_geres || 0, icon: 'folder_shared', color: 'bg-green-500' },
                        { label: 'Médecins suivis', value: '3', icon: 'medical_services', color: 'bg-orange-500' }, // Hardcoded for now if not in API
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-[#1c2229] p-6 rounded-[2rem] border border-slate-200 dark:border-[#2d363f] shadow-sm flex flex-col gap-4">
                            <div className={`size-12 rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                                <span className="material-symbols-outlined">{stat.icon}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">{stat.label}</span>
                                <span className="text-xl font-black text-titles dark:text-white">
                                    {stat.value} <span className="text-sm text-slate-400 font-medium ml-1">{stat.sub}</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Graph Section */}
                <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-xl font-black text-titles dark:text-white">Activité Hospitalière</h3>
                            <p className="text-xs text-slate-500 font-medium">Nombre de visites et examens sur les 6 derniers mois.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-primary"></span>
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mt-0.5">Visites</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chart_data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVisites" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(4px)',
                                        fontSize: '11px',
                                        fontWeight: '800'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="visites"
                                    stroke="#f59e0b"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorVisites)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Quick Actions / Recent RDV */}
                    <div className="lg:col-span-8 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-titles dark:text-white">Dernières activités</h3>
                            <button onClick={() => navigate('/patient/activites')} className="text-xs font-bold text-primary hover:underline">Tout voir</button>
                        </div>

                        <div className="space-y-4">
                            {activites_recentes && activites_recentes.length > 0 ? (
                                activites_recentes.map((item, i) => {
                                    const statutDisplay = item.type === 'rdv' ? item.statut : (item.type === 'demande' ? item.statut : 'Consultation');
                                    return (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm">
                                                    <span className="material-symbols-outlined">
                                                        {item.type === 'rdv' ? 'event_note' : (item.type === 'demande' ? 'assignment' : 'stethoscope')}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-sm font-black text-titles dark:text-white capitalize line-clamp-1">{item.medecin}</span>
                                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                                            <span className="material-symbols-outlined text-[10px] text-slate-400">person</span>
                                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter truncate max-w-[80px]">{item.patient_nom}</span>
                                                        </div>
                                                    </div>
                                                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider line-clamp-1">{item.motif}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-12 text-right">
                                                <div className="hidden sm:flex flex-col">
                                                    <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Date</span>
                                                    <span className="text-sm font-bold text-titles dark:text-white">{formatDate(item.date)}</span>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusColor(statutDisplay)}`}>
                                                    {statutDisplay}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-12 text-center">
                                    <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
                                        <span className="material-symbols-outlined text-3xl">history</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 font-bold">Aucune activité récente pour ce profil.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Profile Completeness or Reminders */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                        <div className="bg-gradient-to-br from-primary to-[#35577D] rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                            <h4 className="text-lg font-black mb-2 relative z-10">Votre Santé</h4>
                            <p className="text-xs text-white/80 mb-6 font-medium relative z-10">
                                Accédez rapidement à votre dossier médical complet.
                            </p>

                            <button onClick={() => navigate('/patient/dossier')} className="w-full mt-2 py-3 bg-white text-primary rounded-2xl font-black text-xs hover:bg-slate-50 transition-all shadow-lg active:scale-95 relative z-10 flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">folder_open</span>
                                Voir mon dossier
                            </button>
                        </div>

                        {/* Formulaire de Demande */}
                        <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm">
                            <h4 className="text-lg font-black text-titles dark:text-white mb-6 flex items-center gap-3">
                                <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">send</span>
                                </div>
                                Faire une demande
                            </h4>

                            {successMessage && (
                                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-bold rounded-2xl border border-green-100 dark:border-green-900/30 animate-in fade-in slide-in-from-top-2 duration-300">
                                    {successMessage}
                                </div>
                            )}

                            <form onSubmit={handleDemandeSubmit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider pl-1">Type de demande</label>
                                    <select
                                        value={demandeForm.type}
                                        onChange={(e) => setDemandeForm({ ...demandeForm, type: e.target.value })}
                                        className="h-11 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold text-titles dark:text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        required
                                    >
                                        <option value="modification_profil">Modification profil</option>
                                        <option value="autre">Autre demande</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider pl-1">Objet</label>
                                    <input
                                        type="text"
                                        placeholder="Sujet de votre demande"
                                        value={demandeForm.objet}
                                        onChange={(e) => setDemandeForm({ ...demandeForm, objet: e.target.value })}
                                        className="h-11 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold text-titles dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider pl-1">Description</label>
                                    <textarea
                                        placeholder="Détails de votre demande..."
                                        rows="4"
                                        value={demandeForm.description}
                                        onChange={(e) => setDemandeForm({ ...demandeForm, description: e.target.value })}
                                        className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold text-titles dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="h-12 bg-primary text-white rounded-2xl font-black text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 mt-2"
                                >
                                    {submitting ? (
                                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[18px]">send</span>
                                            Envoyer la demande
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </PatientLayout>
    );
};

export default PatientDashboard;

