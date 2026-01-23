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

    const [filter, setFilter] = useState('tous'); // 'tous', 'en_attente', 'approuve', 'refuse'

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

    const filteredDemandes = demandes.filter(d => filter === 'tous' || d.statut === filter);

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

    const getPatientName = (patientId) => {
        const patient = patients.find(p => p.id === parseInt(patientId));
        return patient ? `${patient.nom} ${patient.prenom}` : `Patient #${patientId}`;
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase font-display">
                            Demandes de Rendez-vous
                        </h1>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium italic">
                            Gérez les demandes de rendez-vous des patients
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full md:w-auto h-14 px-8 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:translate-y-[-2px] active:translate-y-[0px] transition-all flex items-center justify-center gap-3"
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

                {/* Filtres par onglets */}
                <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-[#1c2229] rounded-2xl w-fit border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto no-scrollbar max-w-full">
                    {[
                        { id: 'tous', label: 'Toutes', count: demandes.length },
                        { id: 'en_attente', label: 'En attente', count: demandes.filter(d => d.statut === 'en_attente').length },
                        { id: 'approuve', label: 'Approuvées', count: demandes.filter(d => d.statut === 'approuve').length },
                        { id: 'refuse', label: 'Refusées', count: demandes.filter(d => d.statut === 'refuse').length },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id)}
                            className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === tab.id
                                ? 'bg-white dark:bg-slate-800 text-primary shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-[8px] ${filter === tab.id ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Formulaire */}
                {showForm && (
                    <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] p-8 shadow-sm animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-titles dark:text-white uppercase italic tracking-tight">Créer une demande</h3>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Sélectionner Patient</label>
                                <select
                                    value={formData.patient_id}
                                    onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                                    className="w-full h-14 px-5 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl text-sm font-bold text-titles dark:text-white transition-all outline-none appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="">Choisir un patient</option>
                                    {patients.map(patient => (
                                        <option key={patient.id} value={patient.id}>
                                            {patient.nom} {patient.prenom}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Type de consultation</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Consultation générale"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full h-14 px-5 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl text-sm font-bold text-titles dark:text-white transition-all outline-none"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Motif (optionnel)</label>
                                <textarea
                                    placeholder="Description brève..."
                                    value={formData.motif}
                                    onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                                    className="w-full h-32 p-5 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl text-sm font-bold text-titles dark:text-white resize-none transition-all outline-none"
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="h-14 px-10 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                                >
                                    Valider la demande
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
                                {filteredDemandes.map((demande) => (
                                    <tr key={demande.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs uppercase">
                                                    {getPatientName(demande.patient_id).charAt(0)}
                                                </div>
                                                <div className="flex flex-col leading-none">
                                                    <span className="text-sm font-black text-titles dark:text-white uppercase tracking-tight">
                                                        {getPatientName(demande.patient_id)}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-bold tracking-widest italic mt-1">
                                                        ID: {demande.patient_id}
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
