import React, { useState, useEffect } from 'react';
import ReceptionLayout from '../../components/layouts/ReceptionLayout';
import { demandeRdvService, patientService } from '../../services';

const DemandesRdv = () => {
    const [demandes, setDemandes] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        patient_id: '',
        type: '',
        motif: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [demandesData, patientsData] = await Promise.all([
                    demandeRdvService.getAllDemandes(),
                    patientService.getAllPatients()
                ]);
                setDemandes(demandesData);
                setPatients(patientsData);
            } catch (err) {
                setError('Erreur lors du chargement des données');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await demandeRdvService.createDemande(formData);
            setShowForm(false);
            setFormData({ patient_id: '', type: '', motif: '' });
            // Recharger les demandes
            const demandesData = await demandeRdvService.getAllDemandes();
            setDemandes(demandesData);
        } catch (err) {
            setError('Erreur lors de la création de la demande');
            console.error(err);
        }
    };

    const handleValider = async (id) => {
        try {
            await demandeRdvService.validerDemande(id);
            // Recharger les demandes
            const demandesData = await demandeRdvService.getAllDemandes();
            setDemandes(demandesData);
        } catch (err) {
            setError('Erreur lors de la validation de la demande');
            console.error(err);
        }
    };

    const getStatutBadge = (statut) => {
        const styles = {
            'en_attente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'approuve': 'bg-green-100 text-green-800 border-green-200',
            'refuse': 'bg-red-100 text-red-800 border-red-200'
        };
        return styles[statut] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    if (loading) {
        return (
            <ReceptionLayout>
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </ReceptionLayout>
        );
    }

    return (
        <ReceptionLayout>
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 transition-all duration-[800ms]">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase">
                            Demandes de Rendez-vous
                        </h1>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium italic">
                            Gérez les demandes de rendez-vous des patients
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="h-14 px-8 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:translate-y-[-2px] active:translate-y-[0px] transition-all flex items-center justify-center gap-3"
                    >
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        Nouvelle Demande
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-600 dark:text-red-400 text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* Formulaire */}
                {showForm && (
                    <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] p-6 shadow-sm">
                        <h3 className="text-lg font-black text-titles dark:text-white mb-4">Créer une demande</h3>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <select
                                value={formData.patient_id}
                                onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
                                className="h-12 px-4 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-xl text-sm font-medium text-titles dark:text-white"
                                required
                            >
                                <option value="">Sélectionner un patient</option>
                                {patients.map(patient => (
                                    <option key={patient.id} value={patient.id}>
                                        {patient.nom} {patient.prenom}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Type de consultation"
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="h-12 px-4 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-xl text-sm font-medium text-titles dark:text-white"
                                required
                            />
                            <textarea
                                placeholder="Motif (optionnel)"
                                value={formData.motif}
                                onChange={(e) => setFormData({...formData, motif: e.target.value})}
                                className="h-24 px-4 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-xl text-sm font-medium text-titles dark:text-white resize-none"
                            />
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="h-12 px-6 bg-primary text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-primary/90 transition-all"
                                >
                                    Créer la demande
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="h-12 px-6 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Liste des demandes */}
                <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Patient</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Type</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Motif</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Date</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Statut</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {demandes.map((demande) => (
                                    <tr key={demande.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                                                    P
                                                </div>
                                                <div className="flex flex-col leading-none">
                                                    <span className="text-sm font-black text-titles dark:text-white uppercase tracking-tight">
                                                        Patient #{demande.patient_id}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-bold text-titles dark:text-white">
                                                {demande.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs text-slate-600 dark:text-slate-400 italic">
                                                {demande.motif || 'Non spécifié'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-black text-titles dark:text-white uppercase tracking-tighter">
                                                {new Date(demande.date_demande).toLocaleDateString('fr-FR')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatutBadge(demande.statut)}`}>
                                                {demande.statut.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3 md:translate-x-4 md:opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                                {demande.statut === 'en_attente' && (
                                                    <button
                                                        onClick={() => handleValider(demande.id)}
                                                        className="h-10 px-6 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-sm"
                                                    >
                                                        Valider
                                                    </button>
                                                )}
                                                <button className="size-10 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-primary hover:shadow-lg transition-all flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ReceptionLayout>
    );
};

export default DemandesRdv;
