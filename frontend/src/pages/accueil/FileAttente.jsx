import React, { useState, useEffect, useCallback, useMemo } from "react";
import ReceptionLayout from "../../components/layouts/ReceptionLayout";
import accueilService from "../../services/accueil/accueilService";

const FileAttente = () => {
  const [queue, setQueue] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [planningRes, patientsRes] = await Promise.all([
        accueilService.getPlanning().catch(() => []),
        accueilService.getPatients().catch(() => []),
      ]);
      setQueue(Array.isArray(planningRes) ? planningRes : []);
      setPatients(Array.isArray(patientsRes) ? patientsRes : []);
    } catch (err) {
      console.error("Erreur lors du chargement de la file:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getPatientInfo = (patientId) => {
    return patients.find((p) => String(p.id) === String(patientId)) || {};
  };

  // Filtrage combiné (Recherche + Statut)
  const filteredQueue = useMemo(() => {
    return queue.filter((item) => {
      const p = getPatientInfo(item.patient_id);
      const searchStr = searchTerm.toLowerCase();

      const matchesSearch =
        p.nom?.toLowerCase().includes(searchStr) ||
        p.prenom?.toLowerCase().includes(searchStr) ||
        String(p.id).includes(searchStr);

      const matchesStatus =
        filterStatus === "all" || item.statut?.toLowerCase() === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [queue, patients, searchTerm, filterStatus]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // On transforme "Passé" en "passé" pour correspondre à l'Enum du backend
      const statusFormatted = newStatus.toLowerCase();

      await accueilService.updateRdvStatus(id, statusFormatted);

      // Mise à jour de l'interface sans recharger
      setQueue((prevQueue) =>
        prevQueue.map((item) =>
          item.id === id ? { ...item, statut: statusFormatted } : item,
        ),
      );
    } catch (err) {
      console.error("Erreur de mise à jour:", err);
      // On affiche l'erreur précise du serveur s'il y en a une
      const serverMsg =
        err.response?.data?.message ||
        "Erreur de communication avec le serveur";
      alert(`Impossible de mettre à jour : ${serverMsg}`);
    }
  };

  if (loading) {
    return (
      <ReceptionLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ReceptionLayout>
    );
  }

  return (
    <ReceptionLayout>
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6">
        {/* EN-TÊTE & RECHERCHE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#1c2229] p-6 rounded-[2rem] shadow-sm border border-slate-200 dark:border-[#2d363f]">
          <div>
            <h1 className="text-2xl font-black text-titles dark:text-white uppercase italic">
              File d'Attente du Jour
            </h1>
            <p className="text-xs text-slate-500 font-bold italic uppercase tracking-widest">
              {queue.filter((q) => q.statut === "programmé").length} patient(s)
              en attente
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="text"
              placeholder="Rechercher un patient (Nom, ID...)"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-[#0f1216] border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* FILTRES DE STATUT */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100/50 dark:bg-slate-800/30 p-1.5 rounded-[1.5rem] self-start border border-slate-200/50">
          {[
            { id: "all", label: "Tous", icon: "group" },
            { id: "programmé", label: "À Traiter", icon: "pending_actions" },
            { id: "passé", label: "Passés", icon: "check_circle" },
            { id: "annulé", label: "Annulés", icon: "cancel" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filterStatus === tab.id
                  ? "bg-white dark:bg-[#1c2229] text-primary shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* TABLEAU DES PATIENTS */}
        <div className="bg-white dark:bg-[#1c2229] rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-[#2d363f] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-[#2d363f]/20 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-8 py-5 text-left text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                    Ordre
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                    Patient
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                    Statut Actuel
                  </th>
                  <th className="px-8 py-5 text-right text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {filteredQueue.length > 0 ? (
                  filteredQueue.map((item, index) => {
                    const patient = getPatientInfo(item.patient_id);
                    const statusStyles = {
                      programmé: "bg-blue-100 text-blue-600",
                      passé: "bg-emerald-100 text-emerald-600",
                      annulé: "bg-rose-100 text-rose-600",
                    };

                    return (
                      <tr
                        key={item.id}
                        className="group hover:bg-slate-50/50 transition-all"
                      >
                        <td className="px-8 py-6 text-xs font-black text-slate-400">
                          #{index + 1}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold uppercase italic text-titles dark:text-white">
                              {patient.nom} {patient.prenom}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold italic">
                              ID: #{patient.id}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span
                            className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${statusStyles[item.statut?.toLowerCase()] || "bg-slate-100"}`}
                          >
                            {item.statut || "Programmé"}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          {item.statut?.toLowerCase() === "programmé" ? (
                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() =>
                                  handleUpdateStatus(item.id, "Passé")
                                }
                                className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                              >
                                <span className="material-symbols-outlined text-sm font-black">
                                  done
                                </span>
                                <span className="text-[10px] font-black uppercase">
                                  Passé
                                </span>
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateStatus(item.id, "Annulé")
                                }
                                className="flex items-center gap-2 px-3 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                              >
                                <span className="material-symbols-outlined text-sm font-black">
                                  close
                                </span>
                                <span className="text-[10px] font-black uppercase">
                                  Annuler
                                </span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-black text-slate-300 uppercase italic tracking-tighter">
                              Traité le {new Date().toLocaleDateString()}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-8 py-20 text-center text-slate-400 font-bold italic uppercase text-xs tracking-widest"
                    >
                      Aucun patient trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ReceptionLayout>
  );
};

export default FileAttente;
