import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReceptionLayout from '../../components/layouts/ReceptionLayout';
import accueilService from '../../services/accueil/accueilService';
import patientService from '../../services/patient/patientService';

const GestionRDV = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rdv, setRdv] = useState([]);
    const [demandes, setDemandes] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Liste statique des médecins (Endpoints backend non disponibles)
    const doctors = [
        { id: '3', nom: 'Dubois', prenom: 'Marc', service: 'Généraliste' },
        { id: '4', nom: 'Kone', prenom: 'Sarah', service: 'Cardiologue' },
        { id: '5', nom: 'Kouassi', prenom: 'Jean', service: 'Pédiatre' }
    ];

    const [formData, setFormData] = useState({
        patient_id: '',
        medecin_id: '3',
        type: 'Consultation générale',
        motif: '',
        date: new Date().toISOString().split('T')[0],
        heure: '08:00',
        statut: 'programmé'
    });

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [sidebarFilter, setSidebarFilter] = useState('en_attente'); // 'en_attente' or 'refuse'

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [patientsData, demandesData] = await Promise.all([
                    patientService.getAllPatients(),
                    demandeRdvService.getAllDemandes().catch(() => [])
                ]);
                setPatients(patientsData);
                setDemandes(demandesData);

                // Filtrer pour n'afficher que les RDV de la date sélectionnée
                const approvedForSelectedDate = demandesData.filter(d => {
                    const isApproved = d.statut === 'approuve';
                    const isSameDate = new Date(d.date_demande).toISOString().split('T')[0] === selectedDate;
                    return isApproved && isSameDate;
                });

                const combinedRdv = approvedForSelectedDate
                    .map(demande => ({
                        time: new Date(demande.date_demande).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                        patient: getPatientName(demande.patient_id, patientsData),
                        doctor: 'À assigner',
                        status: 'Confirmé',
                        color: 'bg-green-100 text-green-600',
                        id: demande.id,
                        rawDate: new Date(demande.date_demande)
                    }))
                    .sort((a, b) => a.rawDate - b.rawDate);
                setRdv(combinedRdv);
            } catch (err) {
                setError('Erreur lors du chargement des données');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedDate]);

    const getPatientName = (patientId, patientsList = patients) => {
        const patient = patientsList.find(p => p.id === parseInt(patientId));
        return patient ? `${patient.nom} ${patient.prenom}` : `Patient #${patientId}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setError(null);
        try {
            await demandeRdvService.createDemande({
                patient_id: formData.patient_id,
                type: formData.type,
                motif: formData.motif,
                date_demande: `${formData.date} ${formData.heure}:00`
            });

            setSuccess(true);
            setTimeout(() => {
                setIsModalOpen(false);
                setSuccess(false);
                setFormData({
                    patient_id: '',
                    medecin_id: '3',
                    type: 'Consultation générale',
                    motif: '',
                    date: new Date().toISOString().split('T')[0],
                    heure: '08:00',
                    statut: 'programmé'
                });
            }, 1500);

            // Recharger les données
            const demandesData = await demandeRdvService.getAllDemandes().catch(() => []);
            setDemandes(demandesData);

        } catch (err) {
            setError('Erreur lors de la création du rendez-vous');
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleValiderDemande = async (demandeId) => {
        try {
            await demandeRdvService.validerDemande(demandeId);

            // Recharger les données
            const demandesData = await demandeRdvService.getAllDemandes().catch(() => []);
            setDemandes(demandesData);

        } catch (err) {
            setError('Erreur lors de la validation de la demande');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <ReceptionLayout>
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
            </ReceptionLayout>
        );
    }

    return (
        <ReceptionLayout>
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6 md:gap-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white tracking-tight italic uppercase font-display">Gestion des Rendez-vous</h1>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium italic">Planifiez et gérez les consultations du centre.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full md:w-auto h-12 px-8 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <span className="material-symbols-outlined text-[18px]">add_circle</span>
                        Nouveau RDV
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-600 dark:text-red-400 text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Calendar / Day View */}
                    <div className="lg:col-span-8 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-6 md:p-8 shadow-sm h-fit">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                            <h3 className="text-lg md:text-xl font-black text-titles dark:text-white uppercase italic tracking-tighter">
                                {selectedDate === new Date().toISOString().split('T')[0] ? "Planning d'aujourd'hui" : "Planning du " + new Date(selectedDate).toLocaleDateString('fr-FR')}
                            </h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        const d = new Date(selectedDate);
                                        d.setDate(d.getDate() - 1);
                                        setSelectedDate(d.toISOString().split('T')[0]);
                                    }}
                                    className="size-9 md:size-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition-all"
                                >
                                    <span className="material-symbols-outlined text-[18px] md:text-[20px]">chevron_left</span>
                                </button>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="text-xs md:text-sm font-black text-titles dark:text-white px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl uppercase italic tracking-tighter border-none outline-none cursor-pointer"
                                />
                                <button
                                    onClick={() => {
                                        const d = new Date(selectedDate);
                                        d.setDate(d.getDate() + 1);
                                        setSelectedDate(d.toISOString().split('T')[0]);
                                    }}
                                    className="size-9 md:size-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition-all"
                                >
                                    <span className="material-symbols-outlined text-[18px] md:text-[20px]">chevron_right</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {rdv.length === 0 ? (
                                <div className="text-center py-20 text-slate-400 font-bold italic border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
                                    <span className="material-symbols-outlined text-4xl mb-4 block">calendar_today</span>
                                    Aucun rendez-vous pour cette date
                                </div>
                            ) : (
                                rdv.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 md:gap-6 p-4 md:p-5 rounded-2xl border border-slate-50 dark:border-slate-800 hover:bg-slate-50 transition-all group cursor-pointer animate-in fade-in shadow-sm hover:shadow-md">
                                        <div className="flex flex-col items-center justify-center min-w-[60px] border-r border-slate-100 dark:border-slate-800 pr-4">
                                            <span className="text-sm font-black text-titles dark:text-white italic">{item.time}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-black text-titles dark:text-white uppercase tracking-tighter truncate">{item.patient}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 italic truncate">{item.doctor}</p>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase whitespace-nowrap ${item.color}`}>
                                            {item.status}
                                        </span>
                                        <button className="size-10 rounded-xl text-slate-300 hover:text-primary transition-colors flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8 h-fit">
                        {/* Demandes Sidebar */}
                        <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm">
                            <div className="flex flex-col gap-6">
                                <div className="flex p-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <button
                                        onClick={() => setSidebarFilter('en_attente')}
                                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${sidebarFilter === 'en_attente' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-400'}`}
                                    >
                                        En attente ({demandes.filter(d => d.statut === 'en_attente').length})
                                    </button>
                                    <button
                                        onClick={() => setSidebarFilter('refuse')}
                                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${sidebarFilter === 'refuse' ? 'bg-white dark:bg-slate-800 text-rose-500 shadow-sm' : 'text-slate-400'}`}
                                    >
                                        Refusées ({demandes.filter(d => d.statut === 'refuse').length})
                                    </button>
                                </div>

                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {demandes.filter(d => d.statut === sidebarFilter).length === 0 ? (
                                        <div className="text-center py-6 text-slate-400 text-[10px] font-bold italic uppercase tracking-widest">
                                            Aucune demande {sidebarFilter === 'en_attente' ? 'en attente' : 'refusée'}
                                        </div>
                                    ) : (
                                        demandes.filter(d => d.statut === sidebarFilter).map((demande) => (
                                            <div key={demande.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3 hover:border-primary/20 transition-all">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-sm font-black text-titles dark:text-white uppercase tracking-tighter">
                                                        {getPatientName(demande.patient_id)}
                                                    </h4>
                                                    <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${sidebarFilter === 'en_attente' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                        {sidebarFilter === 'en_attente' ? 'En attente' : 'Refusée'}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{demande.type}</p>
                                                {sidebarFilter === 'en_attente' && (
                                                    <button
                                                        onClick={() => handleValiderDemande(demande.id)}
                                                        className="w-full h-10 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                                                    >
                                                        Valider
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Médecins actifs */}
                        <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm">
                            <h3 className="text-base font-black text-titles dark:text-white mb-6 uppercase tracking-widest italic">Médecins actifs</h3>
                            <div className="space-y-6">
                                {doctors.map((doc, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm uppercase">
                                                {doc.prenom.charAt(0)}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 size-4 rounded-full border-4 border-white dark:border-[#1c2229] bg-green-500"></div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-titles dark:text-white leading-none mb-1 uppercase tracking-tighter italic">Dr. {doc.nom} {doc.prenom}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{doc.service}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white dark:bg-[#1c2229] w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined">event_available</span>
                                </div>
                                <h3 className="text-xl font-black text-titles dark:text-white tracking-tight uppercase italic">Programmer un RDV</h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="size-10 rounded-2xl bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-all flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            {success && (
                                <div className="p-4 bg-green-50 text-green-600 rounded-2xl text-[10px] font-black uppercase text-center italic border border-green-100 animate-in fade-in slide-in-from-top-2">
                                    ✓ Demande de rendez-vous créée
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] pl-1">Sélectionner Patient</label>
                                    <select
                                        name="patient_id"
                                        value={formData.patient_id}
                                        onChange={handleInputChange}
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
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] pl-1">Type de consultation</label>
                                    <input
                                        type="text"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Consultation générale"
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] pl-1">Médecin</label>
                                    <select
                                        name="medecin_id"
                                        value={formData.medecin_id}
                                        onChange={handleInputChange}
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white outline-none appearance-none cursor-pointer"
                                    >
                                        {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.nom} {d.prenom}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] pl-1">Date souhaitée</label>
                                    <input
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        type="date"
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] pl-1">Motif de consultation (Optionnel)</label>
                                <textarea
                                    name="motif"
                                    value={formData.motif}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Description brève..."
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl p-5 text-sm font-bold text-titles dark:text-white transition-all outline-none resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={actionLoading}
                                className="w-full h-14 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4 disabled:opacity-50"
                            >
                                {actionLoading ? 'Traitement...' : 'Créer la demande'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </ReceptionLayout>
    );
};

export default GestionRDV;
