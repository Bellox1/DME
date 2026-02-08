// import React, { useState, useEffect } from 'react';
// import ReceptionLayout from '../../components/layouts/ReceptionLayout';
// import accueilService from '../../services/accueil/accueilService';

// const StatistiquesReception = () => {
//     const [totalPatients, setTotalPatients] = useState(0);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchStats = async () => {
//             try {
//                 const data = await patientService.getAllPatients();
//                 setTotalPatients(data.length);
//             } catch (err) {
//                 console.error('Error fetching stats:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchStats();
//     }, []);

//     return (
//         <ReceptionLayout>
//             <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6 md:gap-8 transition-all duration-[800ms]">
//                 <div className="flex flex-col gap-1">
//                     <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase">Analyse de Performance</h1>
//                     <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium">Vue d'ensemble de l'activité du centre.</p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
//                     <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-sm flex flex-col items-center text-center group hover:shadow-xl hover:shadow-primary/5 transition-all">
//                         <div className="size-16 md:size-20 rounded-2xl md:rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
//                             <span className="material-symbols-outlined text-3xl md:text-4xl">group</span>
//                         </div>
//                         <h4 className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">Total Patients</h4>
//                         <span className="text-3xl md:text-4xl font-black text-titles dark:text-white italic tracking-tighter">
//                             {loading ? '...' : totalPatients.toLocaleString()}
//                         </span>
//                         <p className="text-[10px] text-green-500 font-black mt-3 md:mt-4 uppercase">+100% (Base initialisée)</p>
//                     </div>

//                     <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-sm flex flex-col items-center text-center group hover:shadow-xl hover:shadow-primary/5 transition-all">
//                         <div className="size-16 md:size-20 rounded-2xl md:rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
//                             <span className="material-symbols-outlined text-3xl md:text-4xl">calendar_month</span>
//                         </div>
//                         <h4 className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">Consultations</h4>
//                         <span className="text-3xl md:text-4xl font-black text-titles dark:text-white italic tracking-tighter">0</span>
//                         <p className="text-[10px] text-slate-400 font-black mt-3 md:mt-4 uppercase">Aucune donnée</p>
//                     </div>

//                     <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-sm flex flex-col items-center text-center group hover:shadow-xl hover:shadow-primary/5 transition-all">
//                         <div className="size-16 md:size-20 rounded-2xl md:rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
//                             <span className="material-symbols-outlined text-3xl md:text-4xl">speed</span>
//                         </div>
//                         <h4 className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">Temps Moyen</h4>
//                         <span className="text-3xl md:text-4xl font-black text-titles dark:text-white italic tracking-tighter">-- min</span>
//                         <p className="text-[10px] text-primary font-black mt-3 md:mt-4 uppercase">Par patient</p>
//                     </div>
//                 </div>

//                 <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-sm">
//                     <h3 className="text-lg md:text-xl font-black text-titles dark:text-white mb-6 md:mb-8 tracking-tight uppercase italic">Activité Récente</h3>
//                     <div className="h-48 md:h-64 w-full flex items-end justify-between gap-2 md:gap-4 px-2 md:px-4 pb-6 md:pb-8">
//                         {[10, 20, 15, 30, 25, 40, totalPatients > 0 ? 100 : 0].map((h, i) => (
//                             <div key={i} className="flex-1 flex flex-col items-center gap-3 md:gap-4 group">
//                                 <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-t-xl md:rounded-t-2xl relative overflow-hidden flex items-end" style={{ height: '100%' }}>
//                                     <div
//                                         className="w-full bg-primary/20 group-hover:bg-primary/60 transition-all rounded-t-lg md:rounded-t-xl"
//                                         style={{ height: `${h}%` }}
//                                     ></div>
//                                 </div>
//                                 <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none">{['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i]}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </ReceptionLayout>
//     );
// };

// export default StatistiquesReception;

import React, { useState, useEffect } from "react";
import ReceptionLayout from "../../components/layouts/ReceptionLayout";
import accueilService from "../../services/accueil/accueilService";

const StatistiquesReception = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalRdvsToday: 0,
    rdvsPassesToday: 0,
    avgTime: 15,
    activity: [0, 0, 0, 0, 0, 0, 0],
    statuts: { programmé: 0, passé: 0, annulé: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await accueilService.getGlobalStats();

        setStats({
          totalPatients: data.total_patients,
          totalRdvsToday: data.total_rdv_today,
          rdvsPassesToday: data.rdvs_passes_today,
          avgTime: data.avg_time,
          activity: data.activity,
          statuts: data.statuts,
        });
      } catch (err) {
        console.error("Erreur lors de la récupération des stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <ReceptionLayout>
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6 md:gap-8 transition-all duration-[800ms]">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase">
            Analyse de Performance
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium">
            Vue d'ensemble de l'activité du centre.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Card: Total Patients */}
          <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-sm flex flex-col items-center text-center group hover:shadow-xl hover:shadow-primary/5 transition-all">
            <div className="size-16 md:size-20 rounded-2xl md:rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl md:text-4xl">
                group
              </span>
            </div>
            <h4 className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">
              Total Patients
            </h4>
            <span className="text-3xl md:text-4xl font-black text-titles dark:text-white italic tracking-tighter">
              {loading ? "..." : stats.totalPatients.toLocaleString()}
            </span>
            <p className="text-[10px] text-green-500 font-black mt-3 md:mt-4 uppercase">
              +100% (Base active)
            </p>
          </div>

          {/* Card: Rendez-vous  */}
          <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-sm flex flex-col items-center text-center group hover:shadow-xl hover:shadow-primary/5 transition-all">
            <div className="size-16 md:size-20 rounded-2xl md:rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl md:text-4xl">
                calendar_month
              </span>
            </div>
            <h4 className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">
              Aujourd'hui
            </h4>
            <span className="text-3xl md:text-4xl font-black text-titles dark:text-white italic tracking-tighter">
              {loading ? "..." : stats.totalRdvsToday}
            </span>
            <p className="text-[10px] text-amber-600 font-black mt-3 md:mt-4 uppercase">
              {stats.rdvsPassesToday} consultation(s) passée(s)
            </p>
          </div>

          {/* Card: Temps Moyen */}
          <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-sm flex flex-col items-center text-center group hover:shadow-xl hover:shadow-primary/5 transition-all">
            <div className="size-16 md:size-20 rounded-2xl md:rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl md:text-4xl">
                speed
              </span>
            </div>
            <h4 className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">
              Temps Moyen
            </h4>
            <span className="text-3xl md:text-4xl font-black text-titles dark:text-white italic tracking-tighter">
              {stats.avgTime} {stats.avgTime !== "--" ? "min" : ""}
            </span>
            <p className="text-[10px] text-primary font-black mt-3 md:mt-4 uppercase">
              Par patient
            </p>
          </div>
        </div>

        {/* Section Intermédiaire : Répartition des statuts (CORRIGÉE) */}
        <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm">
          <h3 className="text-lg font-black text-titles dark:text-white mb-8 tracking-tight uppercase italic flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              analytics
            </span>
            Répartition des statuts (Global)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(stats.statuts || {}).map(([statut, count]) => {
              // Calcul dynamique du total pour la barre de progression
              const totalGlobal = Object.values(stats.statuts).reduce(
                (a, b) => a + b,
                0,
              );
              return (
                <div key={statut} className="flex flex-col gap-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      {statut}
                    </span>
                    <span className="text-xl font-black italic text-titles dark:text-white">
                      {count}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 rounded-full ${
                        statut === "passé"
                          ? "bg-green-500"
                          : statut === "programmé"
                            ? "bg-primary"
                            : "bg-rose-500"
                      }`}
                      style={{
                        width: `${totalGlobal > 0 ? (count / totalGlobal) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart Section */}
        {/* <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-sm">
          <h3 className="text-lg md:text-xl font-black text-titles dark:text-white mb-6 md:mb-8 tracking-tight uppercase italic">
            Activité Récente (7 derniers jours)
          </h3>
          <div className="h-48 md:h-64 w-full flex items-end justify-between gap-2 md:gap-4 px-2 md:px-4 pb-6 md:pb-8">
            {stats.activity.map((val, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-3 md:gap-4 group"
              >
                <div
                  className="w-full bg-slate-50 dark:bg-slate-800 rounded-t-xl md:rounded-t-2xl relative overflow-hidden flex items-end"
                  style={{ height: "100%" }}
                >
                  <div
                    className="w-full bg-primary/20 group-hover:bg-primary/60 transition-all duration-500 rounded-t-lg md:rounded-t-xl"
                    style={{
                      height: `${val > 0 ? (val / Math.max(...stats.activity, 1)) * 100 : 5}%`,
                    }}
                  ></div>
                </div>
                <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none">
                  {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"][i]}
                </span>
              </div>
            ))}
          </div>
        </div> */}

        {/* Chart Section */}
<div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-sm">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
    <h3 className="text-lg md:text-xl font-black text-titles dark:text-white tracking-tight uppercase italic flex items-center gap-2">
      <span className="material-symbols-outlined text-primary">Bar_chart</span>
      Activité Récente
    </h3>
    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-full">
      <span className="size-2 rounded-full bg-primary animate-pulse"></span>
      <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
        Unité : Nombre de Patients
      </span>
    </div>
  </div>

  <div className="h-72 w-full flex items-end justify-between gap-3 md:gap-6 px-2">
    {stats.activity.map((val, i) => {
      const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayLabel = days[date.getDay()];

      const maxVal = Math.max(...stats.activity, 1);
      const heightPercentage = (val / maxVal) * 100;

      return (
        <div key={i} className="flex-1 h-full flex flex-col items-center group">
          {/* Affichage explicite du nombre avec l'unité */}
          <div className="flex flex-col items-center mb-3">
            <span className="text-sm md:text-lg font-black text-titles dark:text-white leading-none">
              {val}
            </span>
            <span className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-tighter">
              Patients
            </span>
          </div>
          
          <div className="relative w-full flex-1 bg-slate-50 dark:bg-slate-800/40 rounded-t-xl md:rounded-t-2xl overflow-hidden flex items-end">
            <div
              className="w-full bg-primary/20 group-hover:bg-primary transition-all duration-500 ease-out rounded-t-lg md:rounded-t-xl relative"
              style={{
                height: `${val > 0 ? heightPercentage : 5}%`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 opacity-0 group-hover:opacity-100"></div>
            </div>
          </div>

          <span className="mt-4 text-[10px] md:text-[11px] font-black text-slate-400 group-hover:text-titles dark:group-hover:text-white uppercase">
            {dayLabel}
          </span>
        </div>
      );
    })}
  </div>
</div>

        
      </div>
    </ReceptionLayout>
  );
};

export default StatistiquesReception;
