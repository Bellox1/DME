// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import ReceptionLayout from '../../components/layouts/ReceptionLayout';
// import accueilService from '../../services/accueil/accueilService';
// import patientService from '../../services/patient/patientService';

// const ReceptionDashboard = () => {
//     const [user] = useState(() => {
//         const saved = localStorage.getItem('user');
//         return saved ? JSON.parse(saved) : { nom: '', prenom: '' };
//     });
//     const [patients, setPatients] = useState([]);
//     const [queue, setQueue] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 const [patientsData, queueDataResponse] = await Promise.all([
//                     patientService.getPatients(), // Fixed method name if changed
//                     accueilService.getQueue().catch(() => [])
//                 ]);

//                 const queueData = Array.isArray(queueDataResponse) ? queueDataResponse : (queueDataResponse.data || []);

//                 setPatients(Array.isArray(patientsData) ? patientsData : (patientsData?.data || []));
//                 setQueue(queueData);
//             } catch (err) {
//                 console.error('Error fetching dashboard data:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();

//         // Rafraîchir toutes les 60 secondes
//         const interval = setInterval(fetchData, 60000);
//         return () => clearInterval(interval);
//     }, []);

//     const getPatientInfo = (patientId) => {
//         return patients.find(p => p.id === parseInt(patientId)) || {};
//     };

//     // Calculate stats from patients data
//     const totalPatients = patients.length;
//     const kidsCount = patients.filter(p => p.type === 'Enfant').length;
//     const adultsCount = patients.filter(p => p.type === 'Adulte').length;

//     // Show actual queue or recent patients if queue is empty
//     const displayList = queue.length > 0
//         ? queue.slice(0, 5)
//         : patients.slice(-5).reverse();

//     return (
//         <ReceptionLayout>
//             <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 md:gap-12 transition-all duration-[800ms]">
//                 {/* Welcome Section Premium Style */}
//                 <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-[#35577D] to-primary p-8 md:p-12 text-white shadow-2xl shadow-primary/20">
//                     <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
//                     <div className="absolute bottom-0 left-0 size-48 bg-primary/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>

//                     <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//                         <div className="flex flex-col gap-2">
//                             <div className="flex items-center gap-3 mb-2">
//                                 <span className="px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic">Statut: Accueil en ligne</span>
//                                 <span className="size-2 rounded-full bg-green-400 animate-ping"></span>
//                             </div>
//                             <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none italic uppercase">
//                                 Bonjour, <span className="text-white/80">{user.prenom} {user.nom}</span> 👋
//                             </h1>
//                             <p className="text-lg text-white/70 font-medium italic max-w-md">
//                                 Prêt pour une nouvelle journée d'accueil ? Le système est prêt pour les inscriptions.
//                             </p>
//                         </div>
//                         <div className="hidden lg:flex items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-inner">
//                             <div className="flex flex-col items-end">
//                                 <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Date d'aujourd'hui</span>
//                                 <span className="text-xl font-black italic">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
//                             </div>
//                             <div className="size-12 rounded-2xl bg-white text-primary flex items-center justify-center shadow-lg">
//                                 <span className="material-symbols-outlined text-[28px]">calendar_today</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Stats Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                     {[
//                         { label: 'Total Patients', value: loading ? '...' : totalPatients, subValue: 'Base de données', icon: 'groups', color: 'bg-primary' },
//                         { label: 'Enfants', value: loading ? '...' : kidsCount, subValue: 'Comptes dépendants', icon: 'child_care', color: 'bg-blue-50' },
//                         { label: 'Adultes', value: loading ? '...' : adultsCount, subValue: 'Comptes autonomes', icon: 'person', color: 'bg-amber-500' },
//                         { label: 'File d\'attente', value: loading ? '...' : queue.length, subValue: 'Salle d\'attente', icon: 'hourglass_empty', color: 'bg-rose-500' },
//                     ].map((stat, i) => (
//                         <div key={i} className="bg-white dark:bg-[#1c2229] p-6 rounded-[2rem] border border-slate-200 dark:border-[#2d363f] shadow-sm flex flex-col gap-4 group hover:shadow-xl hover:shadow-primary/5 transition-all">
//                             <div className={`size-12 rounded-2xl ${i === 1 ? 'bg-blue-500 text-white' : i === 3 ? 'bg-indigo-500 text-white' : stat.color + ' text-white'} flex items-center justify-center shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
//                                 <span className="material-symbols-outlined">{stat.icon}</span>
//                             </div>
//                             <div className="flex flex-col">
//                                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] mb-1">{stat.label}</span>
//                                 <div className="flex items-baseline gap-2">
//                                     <span className="text-2xl font-black text-titles dark:text-white italic tracking-tighter">{stat.value}</span>
//                                     <span className="text-[10px] font-bold text-slate-400 italic">{stat.subValue}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//                     {/* Active Queue Table */}
//                     <div className="lg:col-span-8 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] shadow-sm">
//                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 md:p-8">
//                             <div className="flex flex-col gap-1">
//                                 <h3 className="text-lg md:text-xl font-black text-titles dark:text-white tracking-tight uppercase italic">
//                                     {queue.length > 0 ? 'File d\'attente actuelle' : 'Dernières inscriptions'}
//                                 </h3>
//                                 <p className="text-xs text-slate-500 font-medium italic">
//                                     {queue.length > 0 ? 'Patients attendant une consultation' : 'Récemment ajoutés au système'}
//                                 </p>
//                             </div>
//                             <Link to="/accueil/file-attente" className="w-full sm:w-auto h-10 px-6 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center">Gérer la file</Link>
//                         </div>

//                         <div className="overflow-x-auto px-4 md:px-8 pb-4 md:pb-8">
//                             {loading ? (
//                                 <div className="py-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
//                             ) : (
//                                 <table className="w-full min-w-[600px]">
//                                     <thead>
//                                         <tr className="border-b border-slate-100 dark:border-slate-800">
//                                             <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Patient</th>
//                                             <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">ID / Contact</th>
//                                             <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Status</th>
//                                             <th className="px-4 py-3 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Type</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
//                                         {displayList.map((item, i) => {
//                                             const patient = queue.length > 0 ? getPatientInfo(item.patient_id) : item;
//                                             return (
//                                                 <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
//                                                     <td className="px-4 py-4">
//                                                         <div className="flex items-center gap-3">
//                                                             <div className="size-9 rounded-xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary font-black text-xs shrink-0 uppercase">
//                                                                 {patient.nom ? patient.nom[0] : 'P'}
//                                                             </div>
//                                                             <div className="flex flex-col leading-none min-w-0">
//                                                                 <span className="text-sm font-bold text-titles dark:text-white uppercase tracking-tighter truncate italic">{patient.nom} {patient.prenom}</span>
//                                                                 <span className="text-[10px] text-slate-400 font-bold italic">{patient.tel || 'N/A'}</span>
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                     <td className="px-4 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 italic">#{patient.id}</td>
//                                                     <td className="px-4 py-4">
//                                                         <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase whitespace-nowrap ${queue.length > 0 ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'
//                                                             }`}>
//                                                             {queue.length > 0 ? (item.statut || 'En attente') : 'Enregistré'}
//                                                         </span>
//                                                     </td>
//                                                     <td className="px-4 py-4 text-right">
//                                                         <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase whitespace-nowrap ${patient.type === 'Enfant' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'}`}>
//                                                             {patient.type === 'Enfant' ? 'Élement dépendant' : 'Autonome'}
//                                                         </span>
//                                                     </td>
//                                                 </tr>
//                                             );
//                                         })}
//                                         {displayList.length === 0 && (
//                                             <tr>
//                                                 <td colSpan="4" className="py-12 text-center text-slate-400 font-bold italic uppercase tracking-widest">
//                                                     Aucune donnée disponible
//                                                 </td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </table>
//                             )}
//                         </div>
//                     </div>

//                     {/* Quick Actions Sidebar */}
//                     <div className="lg:col-span-4 flex flex-col gap-6">
//                         <div className="bg-primary/90 backdrop-blur-md rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
//                             <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
//                             <h4 className="text-lg font-black mb-6 relative z-10 leading-tight uppercase tracking-wider italic">Actions Rapides</h4>
//                             <div className="grid grid-cols-1 gap-4 relative z-10">
//                                 <Link to="/accueil/enregistrement" className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 group">
//                                     <span className="material-symbols-outlined p-2 bg-white text-primary rounded-xl group-hover:scale-110 transition-transform">person_add</span>
//                                     <span className="text-sm font-black tracking-tight leading-none uppercase text-left italic">Nouveau Patient</span>
//                                 </Link>
//                                 <Link to="/accueil/rdv" className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 group">
//                                     <span className="material-symbols-outlined p-2 bg-white text-primary rounded-xl group-hover:scale-110 transition-transform">calendar_today</span>
//                                     <span className="text-sm font-black tracking-tight leading-none uppercase text-left italic">Fixer un Rendez-vous</span>
//                                 </Link>
//                                 <Link to="/accueil/demandes-rdv" className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 group">
//                                     <span className="material-symbols-outlined p-2 bg-white text-primary rounded-xl group-hover:scale-110 transition-transform">list_alt</span>
//                                     <span className="text-sm font-black tracking-tight leading-none uppercase text-left italic">Demandes RDV</span>
//                                 </Link>
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//             </div>
//         </ReceptionLayout>
//     );
// };

// export default ReceptionDashboard;



import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import ReceptionLayout from "../../components/layouts/ReceptionLayout";
import accueilService from "../../services/accueil/accueilService";

const ReceptionDashboard = () => {
  const [user] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : { nom: "Service", prenom: "Accueil" };
  });

  const [patients, setPatients] = useState([]);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Récupération des données synchronisée avec accueilService.js
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // On utilise les noms de fonctions EXACTS de ton fichier service
      const [patientsRes, planningRes] = await Promise.all([
        accueilService.getPatients().catch(() => []),
        accueilService.getPlanning().catch(() => []), // Utilise getPlanning à la place de getQueue
      ]);

      setPatients(Array.isArray(patientsRes) ? patientsRes : []);
      setQueue(Array.isArray(planningRes) ? planningRes : []);
    } catch (err) {
      console.error("Erreur Dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Rafraîchissement automatique toutes les minutes
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // 2. Recherche d'info patient pour la file d'attente
  const getPatientInfo = useCallback((patientId) => {
    return patients.find((p) => String(p.id) === String(patientId)) || {};
  }, [patients]);

  // 3. Tes Statistiques (Calculées sur les données mappées de ton service)
  const stats = useMemo(() => {
    const safePatients = patients || [];
    
    // Ton service mappe déjà le type en 'Enfant' ou 'Autonome'
    const countEnfants = safePatients.filter(p => p.type === 'Enfant').length;
    const countAdultes = safePatients.filter(p => p.type === 'Autonome').length;

    return [
      {
        label: "Total Patients",
        value: loading ? "..." : safePatients.length,
        subValue: "Base de données",
        icon: "groups",
        color: "bg-primary",
      },
      {
        label: "Enfants",
        value: loading ? "..." : countEnfants,
        subValue: "Dépendants",
        icon: "child_care",
        color: "bg-blue-500",
      },
      {
        label: "Adultes",
        value: loading ? "..." : countAdultes,
        subValue: "Autonomes",
        icon: "person",
        color: "bg-amber-500",
      },
      {
        label: "File d'attente",
        value: loading ? "..." : queue.length,
        subValue: "Planning du jour",
        icon: "hourglass_empty",
        color: "bg-rose-500",
      },
    ];
  }, [patients, queue.length, loading]);

  return (
    <ReceptionLayout>
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 transition-all duration-[800ms]">
        
        {/* Header Original */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase">
            Tableau de Bord Accueil
          </h1>
          <p className="text-sm text-slate-500 font-medium italic">
            Session active pour {user.prenom} {user.nom}
          </p>
        </div>

        {/* Grille des Stats - Gros Blocs Centrés */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-[#1c2229] p-8 rounded-[2.5rem] border border-slate-200 dark:border-[#2d363f] shadow-sm flex flex-col items-center text-center group hover:shadow-xl transition-all">
              <div className={`size-16 rounded-2xl ${stat.color} text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
              </div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</h4>
              <span className="text-4xl font-black text-titles dark:text-white italic tracking-tighter">
                {stat.value}
              </span>
              <p className="text-[10px] text-slate-400 font-black mt-4 uppercase tracking-widest">{stat.subValue}</p>
            </div>
          ))}
        </div>

        {/* Section Table/Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-lg font-black text-titles dark:text-white mb-6 uppercase italic flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">list_alt</span>
              Aperçu de la file d'attente
            </h3>
            {queue.length === 0 ? (
              <div className="py-10 text-center text-slate-400 italic font-medium uppercase tracking-widest text-xs">
                Aucun patient dans la file aujourd'hui
              </div>
            ) : (
              <div className="space-y-4">
                 {/* Ton rendu de liste ici */}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 bg-primary rounded-[2.5rem] p-8 text-white shadow-xl">
            <h4 className="font-black uppercase italic mb-6">Actions Rapides</h4>
            <div className="flex flex-col gap-3">
              <Link to="/accueil/enregistrement" className="p-4 bg-white/10 rounded-2xl flex items-center gap-4 hover:bg-white/20 transition-all uppercase text-[10px] font-black italic">
                <span className="material-symbols-outlined bg-white text-primary p-2 rounded-xl">person_add</span>
                Inscrire un patient
              </Link>
              <Link to="/accueil/rdv" className="p-4 bg-white/10 rounded-2xl flex items-center gap-4 hover:bg-white/20 transition-all uppercase text-[10px] font-black italic">
                <span className="material-symbols-outlined bg-white text-primary p-2 rounded-xl">calendar_month</span>
                Planifier un RDV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ReceptionLayout>
  );
};

export default ReceptionDashboard;