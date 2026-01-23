import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReceptionLayout from '../../components/layouts/ReceptionLayout';
import { patientService, demandeRdvService } from '../../services';

const GestionRDV = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rdv, setRdv] = useState([]);
    const [demandes, setDemandes] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        patient_id: '',
        type: '',
        motif: '',
        date: '',
        heure: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [patientsData, demandesData] = await Promise.all([
                    patientService.getAllPatients(),
                    demandeRdvService.getAllDemandes().catch(() => []) // Les demandes peuvent ne pas exister encore
                ]);
                setPatients(patientsData);
                setDemandes(demandesData);
                
                // Combiner les RDV existants avec les demandes validées
                const combinedRdv = [
                    // RDV existants (à récupérer depuis une API RDV)
                    // Pour l'instant, on utilise les demandes approuvées
                    ...demandesData.filter(d => d.statut === 'approuve').map(demande => ({
                        time: new Date(demande.date_demande).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                        patient: getPatientName(demande.patient_id),
                        doctor: 'À assigner',
                        status: 'Confirmé',
                        color: 'bg-green-100 text-green-600',
                        id: demande.id
                    }))
                ];
                setRdv(combinedRdv);
            } catch (err) {
                setError('Erreur lors du chargement des données');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getPatientName = (patientId) => {
        const patient = patients.find(p => p.id === patientId);
        return patient ? `${patient.nom} ${patient.prenom}` : `Patient #${patientId}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await demandeRdvService.createDemande({
                patient_id: formData.patient_id,
                type: formData.type || 'Consultation générale',
                motif: formData.motif
            });
            
            setIsModalOpen(false);
            setFormData({ patient_id: '', type: '', motif: '', date: '', heure: '' });
            
            // Recharger les données
            const demandesData = await demandeRdvService.getAllDemandes().catch(() => []);
            setDemandes(demandesData);
            
        } catch (err) {
            setError('Erreur lors de la création du rendez-vous');
            console.error(err);
        }
    };

    const handleValiderDemande = async (demandeId) => {
        try {
            await demandeRdvService.validerDemande(demandeId);
            
            // Recharger les données
            const demandesData = await demandeRdvService.getAllDemandes().catch(() => []);
            setDemandes(demandesData);
            
            const combinedRdv = [
                ...demandesData.filter(d => d.statut === 'approuve').map(demande => ({
                    time: new Date(demande.date_demande).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                    patient: getPatientName(demande.patient_id),
                    doctor: 'À assigner',
                    status: 'Confirmé',
                    color: 'bg-green-100 text-green-600',
                    id: demande.id
                }))
            ];
            setRdv(combinedRdv);
            
        } catch (err) {
            setError('Erreur lors de la validation de la demande');
            console.error(err);
        }
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white tracking-tight leading-none">Gestion des Rendez-vous</h1>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium">Planifiez et gérez les consultations du jour.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full md:w-auto h-12 px-6 md:px-8 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center"
                    >
                        Nouveau RDV
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-600 dark:text-red-400 text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                    {/* Calendar / Day View */}
                    <div className="lg:col-span-8 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
                            <h3 className="text-lg md:text-xl font-black text-titles dark:text-white">Planning d'aujourd'hui</h3>
                            <div className="flex items-center gap-2">
                                <button className="size-9 md:size-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition-all">
                                    <span className="material-symbols-outlined text-[18px] md:text-[20px]">chevron_left</span>
                                </button>
                                <span className="text-xs md:text-sm font-black text-titles dark:text-white px-3 md:px-4 whitespace-nowrap">
                                    {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </span>
                                <button className="size-9 md:size-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition-all">
                                    <span className="material-symbols-outlined text-[18px] md:text-[20px]">chevron_right</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3 md:space-y-4">
                            {rdv.length === 0 ? (
                                <div className="text-center py-8">
                                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">calendar_today</span>
                                    <p className="text-slate-500 dark:text-slate-400">Aucun rendez-vous aujourd'hui</p>
                                </div>
                            ) : (
                                rdv.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 md:gap-6 p-3 md:p-5 rounded-xl md:rounded-2xl border border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group">
                                        <div className="flex flex-col items-center justify-center min-w-[50px] md:min-w-[60px] border-r border-slate-100 dark:border-slate-800 pr-3 md:pr-6">
                                            <span className="text-xs md:text-sm font-black text-titles dark:text-white">{item.time}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs md:text-sm font-black text-titles dark:text-white uppercase tracking-tighter truncate">{item.patient}</h4>
                                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 italic truncate">{item.doctor}</p>
                                        </div>
                                        <span className={`px-2 md:px-4 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase whitespace-nowrap ${item.color}`}>
                                            {item.status}
                                        </span>
                                        <span className="material-symbols-outlined text-[20px] text-slate-300 group-hover:text-primary transition-colors hidden sm:block">more_vert</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Demandes en attente */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] p-8 shadow-sm">
                            <h3 className="text-base font-black text-titles dark:text-white mb-6 uppercase tracking-widest leading-none">Demandes en attente</h3>
                            <div className="space-y-4">
                                {demandes.filter(d => d.statut === 'en_attente').length === 0 ? (
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">Aucune demande en attente</p>
                                ) : (
                                    demandes.filter(d => d.statut === 'en_attente').map((demande) => (
                                        <div key={demande.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-sm font-black text-titles dark:text-white">
                                                    {getPatientName(demande.patient_id)}
                                                </h4>
                                                <span className="px-2 py-1 rounded-full text-[8px] font-black uppercase bg-yellow-100 text-yellow-800">
                                                    En attente
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{demande.type}</p>
                                            <button
                                                onClick={() => handleValiderDemande(demande.id)}
                                                className="w-full h-8 bg-green-500 text-white rounded-lg text-xs font-black uppercase hover:bg-green-600 transition-all"
                                            >
                                                Valider
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Nouveau RDV */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white dark:bg-[#1c2229] w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined">calendar_add_on</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-titles dark:text-white tracking-tight uppercase">Programmer un Rendez-vous</h3>
                                    <p className="text-xs text-slate-500 font-medium italic">Saisie des informations de consultation</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="size-10 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Sélectionner Patient</label>
                                    <select
                                        value={formData.patient_id}
                                        onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none appearance-none cursor-pointer"
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
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                        placeholder="Ex: Consultation générale"
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Motif de consultation (Optionnel)</label>
                                <textarea
                                    value={formData.motif}
                                    onChange={(e) => setFormData({...formData, motif: e.target.value})}
                                    rows="3"
                                    placeholder="Description brève..."
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl p-5 text-sm font-bold text-titles dark:text-white transition-all outline-none resize-none"
                                />
                            </div>

                            <button type="submit" className="w-full h-14 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4">
                                Créer la demande
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </ReceptionLayout>
    );
};

export default GestionRDV;
