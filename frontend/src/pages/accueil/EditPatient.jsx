import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReceptionLayout from '../../components/layouts/ReceptionLayout';
import accueilService from '../../services/accueil/accueilService';

const EditPatient = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPatient = async () => {
            try {
                setLoading(true);
                const data = await accueilService.getPatientById(id);
                
                // On s'assure que TOUS les champs sont initialisés avec une chaîne vide
                // pour que React puisse les afficher correctement dès le chargement
                setFormData({
                    ...data,
                    nom: data.nom || '',
                    prenom: data.prenom || '',
                    sexe: data.sexe || '',
                    tel: data.tel || '',
                    ville: data.ville || '',
                    adresse: data.adresse || '',
                    taille: data.taille || '',
                    poids: data.poids || '',
                    groupe_sanguin: data.groupe_sanguin || '',
                    date_naissance: data.date_naissance || ''
                });
            } catch (err) {
                console.error("Erreur chargement dossier:", err);
                setError("Impossible de charger les données du patient.");
            } finally {
                setLoading(false);
            }
        };
        if (id) loadPatient();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Le service s'occupe de supprimer les infos sensibles (password) avant l'envoi
            await accueilService.updatePatient(id, formData);
            alert("Modification réussie !");
            navigate('/accueil/patients');
        } catch (err) {
            console.error("Erreur handleSubmit:", err);
            const msg = err.response?.data?.message || "Erreur lors de la modification. Vérifiez le numéro de téléphone.";
            alert(msg);
        }
    };

    if (loading) return (
        <ReceptionLayout>
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="animate-pulse font-black uppercase italic text-slate-400">Chargement du dossier...</p>
            </div>
        </ReceptionLayout>
    );

    if (error || !formData) return (
        <ReceptionLayout>
            <div className="p-10 text-center text-red-500 font-black uppercase">
                {error || "Données introuvables"}
                <button onClick={() => navigate(-1)} className="block mx-auto mt-4 text-slate-500 underline">Retour</button>
            </div>
        </ReceptionLayout>
    );

    return (
        <ReceptionLayout>
            <div className="p-8 max-w-4xl mx-auto bg-white dark:bg-[#1c2229] rounded-[2.5rem] border border-slate-200 dark:border-[#2d363f] shadow-xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-black italic uppercase text-slate-800 dark:text-white">Modifier le Dossier</h1>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Mise à jour des informations patient</p>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${formData.type === 'Enfant' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                        {formData.type}
                    </span>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* SECTION 1 : IDENTITÉ (NOM & PRÉNOM) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 pl-2">Nom</label>
                            <input 
                                className="h-14 px-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all"
                                value={formData.nom} 
                                onChange={e => setFormData({...formData, nom: e.target.value.toUpperCase()})} 
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 pl-2">Prénom</label>
                            <input 
                                className="h-14 px-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all"
                                value={formData.prenom} 
                                onChange={e => setFormData({...formData, prenom: e.target.value})} 
                                required
                            />
                        </div>
                    </div>

                    {/* SECTION 2 : INFOS GÉNÉRALES */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 pl-2">Sexe</label>
                            <select 
                                className="h-14 px-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all"
                                value={formData.sexe}
                                onChange={e => setFormData({...formData, sexe: e.target.value})}
                                required
                            >
                                <option value="">Choisir</option>
                                <option value="Homme">Homme</option>
                                <option value="Femme">Femme</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 pl-2">Date de naissance</label>
                            <input 
                                type="date"
                                className="h-14 px-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all"
                                value={formData.date_naissance} 
                                onChange={e => setFormData({...formData, date_naissance: e.target.value})} 
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 pl-2">Ville</label>
                            <input 
                                type="text"
                                className="h-14 px-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all"
                                value={formData.ville} 
                                onChange={e => setFormData({...formData, ville: e.target.value})} 
                                placeholder="Ex: Cotonou"
                            />
                        </div>
                    </div>

                    {/* SECTION 3 : DONNÉES MÉDICALES (Celles qui étaient vides) */}
                    <div className="p-6 bg-slate-50/50 dark:bg-slate-900/30 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 pl-2">Taille (cm)</label>
                            <input 
                                type="number"
                                className="h-14 px-5 bg-white dark:bg-slate-800 rounded-2xl border-none font-bold text-slate-700 dark:text-white"
                                value={formData.taille} 
                                onChange={e => setFormData({...formData, taille: e.target.value})} 
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 pl-2">Poids (kg)</label>
                            <input 
                                type="number"
                                className="h-14 px-5 bg-white dark:bg-slate-800 rounded-2xl border-none font-bold text-slate-700 dark:text-white"
                                value={formData.poids} 
                                onChange={e => setFormData({...formData, poids: e.target.value})} 
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 pl-2">Groupe Sanguin</label>
                            <select 
                                className="h-14 px-5 bg-white dark:bg-slate-800 rounded-2xl border-none font-bold text-slate-700 dark:text-white"
                                value={formData.groupe_sanguin}
                                onChange={e => setFormData({...formData, groupe_sanguin: e.target.value})}
                            >
                                <option value="">Inconnu</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* SECTION 4 : TÉLÉPHONE (Uniquement si ce n'est pas un enfant) */}
                    {formData.type !== 'Enfant' && (
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase text-primary pl-2 tracking-widest font-bold">Numéro de téléphone (Identifiant)</label>
                            <input 
                                className="h-14 px-5 bg-primary/5 dark:bg-primary/10 rounded-2xl border-2 border-primary/20 font-black text-primary focus:border-primary transition-all outline-none"
                                value={formData.tel} 
                                onChange={e => setFormData({...formData, tel: e.target.value})} 
                                required
                            />
                        </div>
                    )}

                    {/* ACTIONS */}
                    <div className="flex gap-4 mt-4">
                        <button type="button" onClick={() => navigate(-1)} className="flex-1 h-16 rounded-2xl font-black uppercase text-[11px] tracking-widest border border-slate-200 dark:border-slate-700 dark:text-white hover:bg-slate-50 transition-all">
                            Annuler
                        </button>
                        <button type="submit" className="flex-[2] h-16 bg-primary text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">
                            Enregistrer les modifications
                        </button>
                    </div>
                </form>
            </div>
        </ReceptionLayout>
    );
};

export default EditPatient;