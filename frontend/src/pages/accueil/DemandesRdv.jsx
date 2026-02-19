import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import ReceptionLayout from "../../components/layouts/ReceptionLayout";
import accueilService from "../../services/accueil/accueilService";

const DemandesRdv = () => {
  const [demandes, setDemandes] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: "",
    objet: "",
    type: "rendez-vous",
    description: "",
  });
  const [filter, setFilter] = useState("tous");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [demandesData, patientsData] = await Promise.all([
        accueilService.getAllDemandesPatients(),
        accueilService.getPatients(),
      ]);

      // --- LOGIQUE D'EXTRACTION ---
      // Ton backend stocke l'ID dans la description [PATIENT_ID:X]
      // On transforme les données pour que le tableau puisse les lire
      const mappedDemandes = (
        Array.isArray(demandesData) ? demandesData : []
      ).map((d) => {
        const match = d.description?.match(/\[PATIENT_ID:(\d+)\]/);
        return {
          ...d,
          patient_id: match ? match[1] : d.utilisateur_id, // Fallback sur utilisateur_id
        };
      });

      setDemandes(mappedDemandes);
      setPatients(Array.isArray(patientsData) ? patientsData : []);
    } catch (err) {
      console.error("Erreur chargement données:", err);
      setError("Erreur lors de la récupération des données.");
      setDemandes([]);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getPatientName = (patientId) => {
    if (!patientId) return "Inconnu";

    // On s'assure que patients est un tableau
    const listePatients = Array.isArray(patients) ? patients : [];

    const patient = listePatients.find(
      (p) => String(p.id) === String(patientId),
    );

    if (patient) {
      return `${patient.nom} ${patient.prenom}`.toUpperCase();
    }

    return `ID: ${patientId} (Non trouvé)`;
  };

  const getStatutBadge = (statut) => {
    const s = statut?.toLowerCase() || "";
    if (s.includes("attente"))
      return "bg-yellow-400 text-yellow-900 border-yellow-500";
    if (s.includes("programm") || s.includes("approuv"))
      return "bg-green-500 text-white border-green-600";
    if (s.includes("annul") || s.includes("rejet"))
      return "bg-red-500 text-white border-red-600";
    return "bg-slate-100 text-slate-500 border-slate-200";
  };

  const handleValider = async (id) => {
    if (!window.confirm("Approuver ce rendez-vous ?")) return;
    try {
      setError(null);
      // On appelle la fonction qui tape sur /demande-rdv
      await accueilService.approuverDemandePatient(id);
      await loadData(); // Recharge la liste
    } catch (err) {
      console.error("Erreur validation:", err);
      setError("Erreur lors de la validation. Vérifiez la console.");
    }
  };

  const handleRejeter = async (id) => {
    const { value: motif } = await Swal.fire({
      title: "Rejeter la demande",
      input: "textarea",
      inputLabel: "Motif du rejet",
      inputPlaceholder: "Saisissez la raison du refus ici...",
      inputAttributes: {
        "aria-label": "Saisissez la raison du refus",
      },
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Confirmer le rejet",
      cancelButtonText: "Annuler",
      inputValidator: (value) => {
        if (!value) {
          return "Vous devez spécifier un motif !"; // Respecte ton backend : required_if
        }
      },
    });

    if (motif) {
      try {
        await accueilService.rejeterDemande(id, motif);

        // Mise à jour de l'UI
        setDemandes((prev) => prev.filter((d) => d.id !== id));

        Swal.fire(
          "Rejeté !",
          "La demande a été rejetée avec succès.",
          "success",
        );
      } catch (error) {
        Swal.fire(
          "Erreur",
          error.response?.data?.message ||
            "Une erreur est survenue lors du rejet.",
          "error",
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // On envoie les données telles qu'attendues par DemandeRdvController@store
      await accueilService.createDemandeRdv({
        patient_id: formData.patient_id,
        objet: formData.objet,
        description: formData.description,
        type: "rendez-vous",
      });

      setShowForm(false);
      setFormData({
        patient_id: "",
        objet: "",
        type: "rendez-vous",
        description: "",
      });
      loadData();
    } catch (err) {
      console.error("Erreur lors de la soumission:", err); // Utilisation de 'err'
      setError("Erreur lors de la création de la demande.");
    }
  };

  const filteredDemandes = demandes.filter((d) => {
    if (filter === "tous") return true;
    if (filter === "en_attente") return d.statut.includes("attente");
    if (filter === "approuvé")
      return d.statut.includes("approuv") || d.statut.includes("programm");
    if (filter === "annulé")
      return d.statut.includes("annul") || d.statut.includes("rejet");
    return false;
  });

  const handleVoirDemande = (demande) => {
    // On nettoie la description pour l'affichage (on enlève les tags techniques)
    const descriptionPropre = demande.description
      .replace(/\[PATIENT_ID:\d+\]/g, "")
      .trim();

    Swal.fire({
      title: `<span style="font-size: 18px; font-weight: 900; text-transform: uppercase;">Détails de la Demande</span>`,
      html: `
            <div style="text-align: left; font-family: sans-serif; font-size: 14px; line-height: 1.6;">
                <p><strong>Objet :</strong> ${demande.objet}</p>
                <p><strong>Statut :</strong> <span style="color: ${demande.statut === "en_attente" ? "#f59e0b" : demande.statut === "approuvé" ? "#10b981" : "#ef4444"}">${demande.statut.toUpperCase()}</span></p>
                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #eee;">
                <p><strong>Message du patient :</strong></p>
                <div style="background: #f8fafc; padding: 10px; border-radius: 8px; border-left: 4px solid #cbd5e1;">
                    ${descriptionPropre}
                </div>
                <p style="margin-top: 10px; font-size: 12px; color: #64748b;">Créée le : ${new Date(demande.date_creation).toLocaleDateString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</p>
            </div>
        `,
      confirmButtonText: "Fermer",
      confirmButtonColor: "#64748b",
      customClass: {
        popup: "rounded-2xl",
      },
    });
  };

  // const handleAction = async (id, actionType) => {
  //   try {
  //     setError(null);
  //     if (actionType === "valider") {
  //       // On utilise le nouveau nom ici !
  //       await accueilService.approuverDemandePatient(id);
  //     } else {
  //       // Et ici aussi
  //       await accueilService.rejeterDemandePatient(id);
  //     }

  //     // Rafraîchissement des données
  //     await loadData();
  //   } catch (err) {
  //     console.error("Erreur interface:", err);
  //     setError(
  //       "L'action a échoué. Vérifiez si la route /demande-rdv/{id}/status existe.",
  //     );
  //   }
  // };

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white uppercase italic">
            Demandes de Rendez-vous
          </h1>
          {/* <button
            onClick={() => setShowForm(true)}
            className="h-14 px-8 bg-primary text-white rounded-2xl text-[11px] font-black uppercase flex items-center gap-3 shadow-lg hover:bg-opacity-90 transition-all"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Nouvelle Demande
          </button>*/}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm font-medium flex justify-between">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* Onglets de filtrage */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-[#1c2229] rounded-2xl w-fit border border-slate-200">
          {[
            { id: "tous", label: "Toutes", count: demandes.length },
            {
              id: "en_attente",
              label: "En attente",
              count: demandes.filter((d) => d.statut === "en_attente").length,
            },
            {
              id: "approuvé",
              label: "Approuvées",
              count: demandes.filter(
                (d) => d.statut === "approuvé" || d.statut === "programmé",
              ).length,
            },
            {
              id: "annulé",
              label: "Rejetées",
              count: demandes.filter(
                (d) => d.statut === "annulé" || d.statut === "rejeté",
              ).length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                filter === tab.id
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {showForm && (
          <div className="bg-white dark:bg-[#1c2229] border border-slate-200 rounded-[2rem] p-8 animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase italic dark:text-white">
                Créer une demande
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-rose-500"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 pl-1">
                  Patient concerné
                </label>
                <select
                  value={formData.patient_id}
                  onChange={(e) =>
                    setFormData({ ...formData, patient_id: e.target.value })
                  }
                  className="w-full h-14 px-5 bg-slate-50 dark:bg-slate-900 rounded-2xl text-sm font-bold border border-transparent focus:border-primary outline-none"
                  required
                >
                  <option value="">Choisir un patient...</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nom} {p.prenom} ({p.type})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 pl-1">
                  Objet du RDV
                </label>
                <input
                  type="text"
                  placeholder="Ex: Consultation Générale"
                  value={formData.objet}
                  onChange={(e) =>
                    setFormData({ ...formData, objet: e.target.value })
                  }
                  className="w-full h-14 px-5 bg-slate-50 dark:bg-slate-900 rounded-2xl text-sm font-bold border border-transparent focus:border-primary outline-none"
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 pl-1">
                  Description / Motif
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl text-sm font-bold border border-transparent focus:border-primary outline-none min-h-[100px]"
                  placeholder="Détails supplémentaires..."
                />
              </div>
              <div className="md:col-span-2 flex justify-end pt-4">
                <button
                  type="submit"
                  className="h-14 px-10 bg-primary text-white rounded-2xl text-xs font-black uppercase shadow-lg hover:shadow-primary/20"
                >
                  Enregistrer la demande
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white dark:bg-[#1c2229] border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400">
                  Patient
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400">
                  Objet / Type
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400">
                  Statut
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDemandes.length > 0 ? (
                filteredDemandes.map((demande) => (
                  <tr
                    key={demande.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black uppercase text-primary">
                          {getPatientName(demande.patient_id)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          Créée le{" "}
                          {new Date(
                            demande.date_creation || demande.created_at,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-titles">
                          {demande.objet || "Sans objet"}
                        </span>
                        <span className="text-[11px] text-slate-500 italic truncate max-w-[200px]">
                          {demande.description?.replace(
                            /\[PATIENT_ID:\d+\]/,
                            "",
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${getStatutBadge(demande.statut)}`}
                      >
                        {demande.statut}
                      </span>
                    </td>

                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {/* ÉTAPE 1 : Le bouton VOIR est TOUJOURS là, quoi qu'il arrive */}
                        <button
                          onClick={() => handleVoirDemande(demande)}
                          className="h-9 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[9px] font-black uppercase transition-all flex items-center"
                        >
                          Voir la demande
                        </button>

                        {/* ÉTAPE 2 : On ouvre la condition SEULEMENT pour les boutons d'action */}
                        {demande.statut === "en_attente" && (
                          <>
                            <button
                              onClick={() => handleValider(demande.id)}
                              className="h-9 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg text-[9px] font-black uppercase transition-all shadow-sm"
                            >
                              Approuver
                            </button>
                            <button
                              onClick={() => handleRejeter(demande.id)}
                              className="h-9 px-4 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-lg text-[9px] font-black uppercase transition-all"
                            >
                              Rejeter
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-8 py-20 text-center text-slate-400 italic"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-4xl opacity-20">
                        event_busy
                      </span>
                      Aucune demande de rendez-vous trouvée.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ReceptionLayout>
  );
};

export default DemandesRdv;
