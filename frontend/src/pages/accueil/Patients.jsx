import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReceptionLayout from "../../components/layouts/ReceptionLayout";
import accueilService from "../../services/accueil/accueilService";
import toast, { Toaster } from "react-hot-toast";

const ListePatients = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [sortOrder, setSortOrder] = useState("DESC");
  const [filterType, setFilterType] = useState("Tous");
  const [sortBy, setSortBy] = useState("id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resendingId, setResendingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 20; // Nombre de patients par page

 useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await accueilService.getPatients({
          page: currentPage,
          per_page: perPage,
          search: search,
          type: filterType === "Adulte" ? "Autonome" : filterType,
        });

        // Adaptation selon la structure de ta réponse Laravel
        setPatients(response.items || []);
        setTotalItems(response.totalReel || 0);
        setTotalPages(Math.ceil((response.totalReel || 0) / perPage));
        setError(null);
      } catch (err) {
        console.error("Erreur de chargement:", err);
        setError("Impossible de charger les patients");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, search, filterType]); 

  // Reset de la page quand on filtre ou recherche
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterType]);

  const stats = useMemo(() => {
    return {
      total: totalItems, // Utilise la valeur réelle du backend
      autonomes: patients.filter((p) => p.type === "Autonome").length, // Note: Ceci ne comptera que sur la page actuelle
      enfants: patients.filter((p) => p.type === "Enfant").length,
    };
  }, [patients, totalItems]);

 
  // 1. Logique de filtrage et tri mémorisée pour la performance
  const filteredAndSortedPatients = useMemo(() => {
    return patients
      .filter((patient) => {
        const searchLower = search.toLowerCase();
        const fullName = `${patient.nom} ${patient.prenom}`.toLowerCase();

        const matchesSearch =
          fullName.includes(searchLower) ||
          patient.id.toString().includes(searchLower) ||
          (patient.tel && patient.tel.includes(searchLower));

        const matchesType =
          filterType === "Tous" ||
          patient.type === (filterType === "Adulte" ? "Autonome" : filterType);

        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === "id") {
          comparison = parseInt(a.id) - parseInt(b.id);
        } else if (sortBy === "nom") {
          const nameA = (a.nom || "").toLowerCase();
          const nameB = (b.nom || "").toLowerCase();
          comparison = nameA.localeCompare(nameB);
        }
        return sortOrder === "DESC" ? -comparison : comparison;
      });
  }, [patients, search, filterType, sortBy, sortOrder]);

  const handleEdit = (id) => {
    navigate(`/accueil/patients/edit/${id}`);
  };

  const handleResend = async (patient) => {
    const userId = patient.utilisateur_id || patient.id;

    if (!userId) {
      toast.error("Identifiant du patient introuvable");
      return;
    }

    try {
      setResendingId(userId);

      // L'appel au service sécurisé par tes clés de 256 caractères
      await accueilService.resendActivation(userId);

      toast.success("Lien d'activation envoyé avec succès !");
    } catch (err) {
      // Si le token de l'agent expire ici, le middleware utilisera
      // le REFRESH_TOKEN_SECRET (256 chars) pour le reconnecter.
      toast.error(err.message || "Erreur lors de l'envoi WhatsApp");
    } finally {
      setResendingId(null);
    }
  };

  return (
    <ReceptionLayout>
      <Toaster position="top-right" />
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6 md:gap-8 transition-all duration-[800ms]">
        <div className="mb-2 md:mb-4 text-titles dark:text-white">
          <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase">
            Gestion des Dossiers Patients
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium italic mt-2">
            Consultez, modifiez et créez les dossiers médicaux de la clinique.
          </p>
        </div>

        {/* Barre de Recherche et Actions */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
                search
              </span>
              <input
                type="text"
                placeholder="Rechercher par nom, ID ou téléphone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-14 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-2xl pl-12 pr-6 text-sm font-bold text-titles dark:text-white outline-none focus:border-primary/50 transition-all shadow-sm"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  setSortOrder((prev) => (prev === "DESC" ? "ASC" : "DESC"))
                }
                className="h-14 px-6 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] text-titles dark:text-white rounded-2xl flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm group"
              >
                <span
                  className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${sortOrder === "DESC" ? "" : "rotate-180"}`}
                >
                  straight
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                  {sortOrder}
                </span>
              </button>

              <Link
                to="/accueil/enregistrement"
                className="h-14 px-8 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:translate-y-[-2px] active:translate-y-[0px] transition-all flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined text-[20px]">
                  person_add
                </span>
                Nouveau Patient
              </Link>
            </div>
          </div>

          {/* Filtres Rapides */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                Options:
              </span>
              <div className="flex flex-wrap bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] p-1 rounded-xl shadow-sm gap-1">
                <div className="flex gap-1 border-r border-slate-100 dark:border-slate-800 pr-1 mr-1">
                  {["Tous", "Adulte", "Enfant"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                        filterType === type
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "text-slate-400 hover:text-titles dark:hover:text-white"
                      }`}
                    >
                      {type === "Tous"
                        ? "Tous"
                        : type === "Adulte"
                          ? "Autonomes"
                          : "Enfants"}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1">
                  {["id", "nom"].map((key) => (
                    <button
                      key={key}
                      onClick={() => setSortBy(key)}
                      className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                        sortBy === key
                          ? "bg-slate-100 dark:bg-slate-800 text-primary shadow-sm"
                          : "text-slate-400 hover:text-titles dark:hover:text-white"
                      }`}
                    >
                      {key === "id" ? "Date / ID" : "Nom"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table des Patients */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-600 dark:text-red-400 text-sm font-medium text-center">
            {error}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                      Patient / ID
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                      Type
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                      Contact / Tuteur
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                      Visite
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {filteredAndSortedPatients.length > 0 ? (
                    filteredAndSortedPatients.map((patient) => (
                      <tr
                        key={patient.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs uppercase">
                              {patient.nom?.[0]}
                              {patient.prenom?.[0]}
                            </div>
                            <div className="flex flex-col leading-none">
                              <span className="text-sm font-black text-titles dark:text-white uppercase tracking-tight mb-1">
                                {patient.nom} {patient.prenom}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold tracking-widest italic">
                                ID: {patient.id}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              patient.type === "Enfant"
                                ? "bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                                : "bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                            }`}
                          >
                            {patient.type}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                            {patient.tel || "N/A"}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                              {patient.derniere_visite
                                ? new Date(
                                    patient.derniere_visite,
                                  ).toLocaleDateString("fr-FR")
                                : "Nouveau"}
                            </span>

                            {/* <span>
  {patient.derniere_visite && !isNaN(Date.parse(patient.derniere_visite))
    ? new Date(patient.derniere_visite).toLocaleDateString("fr-FR")
    : "Nouveau"}
</span> */}

                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                              Dernier RDV
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() => handleEdit(patient.id)}
                            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-400 hover:text-blue-500 rounded-lg transition-all"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              edit
                            </span>
                          </button>

                          {/* <button
                            onClick={() => handleResend(patient)}
                            disabled={
                              resendingId ===
                              (patient.utilisateur_id || patient.id)
                            }
                            className="btn-resend"
                          >
                            {resendingId ===
                            (patient.utilisateur_id || patient.id) ? (
                              <span className="spinner">Envoi...</span>
                            ) : (
                              "Renvoyer le lien"
                            )}
                          </button> */}

                          <button
                            onClick={() => handleResend(patient)}
                            disabled={
                              resendingId ===
                              (patient.utilisateur_id || patient.id)
                            }
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                              resendingId ===
                              (patient.utilisateur_id || patient.id)
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                            }`}
                          >
                            {resendingId ===
                            (patient.utilisateur_id || patient.id) ? (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                Envoi...
                              </div>
                            ) : (
                              "Renvoyer le lien"
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-8 py-12 text-center text-slate-400 font-bold italic uppercase tracking-widest"
                      >
                        Aucun patient trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTRÔLES DE PAGINATION */}
        {!loading && !error && totalItems > perPage && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-8 py-6 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Affichage de {(currentPage - 1) * perPage + 1} à{" "}
              {Math.min(currentPage * perPage, totalItems)} sur {totalItems}{" "}
              patients
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="size-10 rounded-xl bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] flex items-center justify-center text-slate-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">
                  chevron_left
                </span>
              </button>

              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  // Logique simple pour afficher quelques numéros de page
                  let pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`size-10 rounded-xl text-[11px] font-black transition-all ${
                        currentPage === pageNum
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "bg-white dark:bg-[#1c2229] text-slate-400 border border-slate-200 dark:border-[#2d363f] hover:border-primary/50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="size-10 rounded-xl bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] flex items-center justify-center text-slate-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Section Statistiques - RENDUE FONCTIONNELLE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-[2rem] bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] shadow-sm flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-900/10 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined">group</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-titles dark:text-white">
                {stats.total}
              </span>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">
                Total Patients
              </span>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] shadow-sm flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-green-50 dark:bg-green-900/10 text-green-600 flex items-center justify-center">
              <span className="material-symbols-outlined">person_check</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-titles dark:text-white">
                {stats.autonomes}
              </span>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">
                Autonomes
              </span>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] shadow-sm flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined">family_restroom</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-titles dark:text-white">
                {stats.enfants}
              </span>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">
                Enfants
              </span>
            </div>
          </div>

          {/* <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary to-[#35577D] border-none shadow-lg shadow-primary/20 flex items-center gap-4 text-white">
                        <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <span className="material-symbols-outlined">verified</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black italic">{stats.verifies}</span>
                            <span className="text-[10px] font-black uppercase text-white/70 tracking-widest leading-none">Dossiers Vérifiés</span>
                        </div>
                    </div> */}
        </div>
      </div>
    </ReceptionLayout>
  );
};

export default ListePatients;
