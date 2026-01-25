import React, { useState, useEffect } from 'react';
import PatientLayout from '../../components/layouts/PatientLayout';
import patientService from '../../services/patient/patientService';

const Consultations = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [consultations, setConsultations] = useState([]);
    const [demandes, setDemandes] = useState([]);
    const [activeTab, setActiveTab] = useState('rendez-vous');
    
    const [formData, setFormData] = useState({
        objet: '',
        description: '',
        date_souhaitee: '',
        time: ''
    });

    const loadData = async () => {
        try {
            const rdvData = await patientService.getMesRdv();
            setConsultations(rdvData || []);
            
            const demandesData = await patientService.getMesDemandes();
            setDemandes(demandesData || []);
        } catch (error) {
            console.error('Erreur de chargement:', error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await patientService.createDemandeRdv(formData);
            setMessage('Demande de rendez-vous envoyée avec succès !');
            setMessageType('success');
            setFormData({ objet: '', description: '', date_souhaitee: '', time: '' });
            setIsModalOpen(false);
            
            const demandesData = await patientService.getMesDemandes();
            setDemandes(demandesData || []);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Erreur lors de l\'envoi de la demande');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAnnulerRdv = async (rdvId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
            return;
        }

        try {
            await patientService.annulerRdv(rdvId);
            setMessage('Rendez-vous annulé avec succès');
            setMessageType('success');
            await loadData();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Erreur lors de l\'annulation');
            setMessageType('error');
        }
    };

    return (
        <PatientLayout>
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6 md:gap-8 transition-all duration-[800ms]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white tracking-tight uppercase italic">
                            Mes <span className="text-secondary">Consultations</span>
                        </h1>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium italic">Historique et rendez-vous à venir.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full md:w-auto h-12 px-6 md:px-8 bg-primary text-white rounded-2xl font-black text-xs md:text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Prendre rendez-vous
                    </button>
                </div>

                {/* Onglets */}
                <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] p-2 flex gap-2">
                    <button
                        onClick={() => setActiveTab('rendez-vous')}
                        className={`flex-1 py-3 px-6 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${
                            activeTab === 'rendez-vous'
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        Mes Rendez-vous ({consultations.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('demandes')}
                        className={`flex-1 py-3 px-6 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${
                            activeTab === 'demandes'
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        Mes Demandes ({demandes.filter(d => d.statut === 'en_attente').length})
                    </button>
                </div>

                {/* Message de feedback */}
                {message && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 ${
                        messageType === 'success'
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                    }`}>
                        <span className="material-symbols-outlined text-[20px]">
                            {messageType === 'success' ? 'check_circle' : 'error'}
                        </span>
                        <span className="font-medium">{message}</span>
                    </div>
                )}

                {/* Contenu selon l'onglet actif */}
                {activeTab === 'rendez-vous' ? (
                    <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[900px]">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-[#2d363f] bg-slate-50/50 dark:bg-slate-900/30">
                                        <th className="px-4 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Objet</th>
                                        <th className="px-4 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Description</th>
                                        <th className="px-4 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Date demande</th>
                                        <th className="px-4 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Statut</th>
                                        <th className="px-4 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-[#2d363f]">
                                    {consultations.length > 0 ? (
                                        consultations.map((c) => (
                                            <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                                <td className="px-4 md:px-8 py-4 md:py-5">
                                                    <span className="text-xs md:text-[13px] font-bold text-titles dark:text-white">{c.objet}</span>
                                                </td>
                                                <td className="px-4 md:px-8 py-4 md:py-5">
                                                    <span className="text-xs md:text-[13px] text-slate-600 dark:text-slate-300 line-clamp-2">{c.description}</span>
                                                </td>
                                                <td className="px-4 md:px-8 py-4 md:py-5">
                                                    <span className="text-xs md:text-[13px] font-bold text-titles dark:text-white">
                                                        {new Date(c.date_creation).toLocaleDateString('fr-FR')}
                                                    </span>
                                                </td>
                                                <td className="px-4 md:px-8 py-4 md:py-5">
                                                    <span className="px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase inline-flex whitespace-nowrap bg-green-100 text-green-600 dark:bg-green-900/20">
                                                        Confirmé
                                                    </span>
                                                </td>
                                                <td className="px-4 md:px-8 py-4 md:py-5">
                                                    <div className="flex items-center gap-2">
                                                        <button className="size-8 md:size-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary transition-all flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-[16px] md:text-[18px]">visibility</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-4 md:px-8 py-8 text-center text-slate-500">
                                                <div className="flex flex-col items-center gap-3">
                                                    <span className="material-symbols-outlined text-[48px] text-slate-300">calendar_today</span>
                                                    <span className="font-medium">Aucun rendez-vous confirmé</span>
                                                    <span className="text-sm">Vos rendez-vous apparaîtront ici une fois validés</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[900px]">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-[#2d363f] bg-slate-50/50 dark:bg-slate-900/30">
                                        <th className="px-4 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Objet</th>
                                        <th className="px-4 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Description</th>
                                        <th className="px-4 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Date demande</th>
                                        <th className="px-4 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Statut</th>
                                        <th className="px-4 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-[#2d363f]">
                                    {demandes.length > 0 ? (
                                        demandes.map((d) => (
                                            <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                                <td className="px-4 md:px-8 py-4 md:py-5">
                                                    <span className="text-xs md:text-[13px] font-bold text-titles dark:text-white">{d.objet}</span>
                                                </td>
                                                <td className="px-4 md:px-8 py-4 md:py-5">
                                                    <span className="text-xs md:text-[13px] text-slate-600 dark:text-slate-300 line-clamp-2">{d.description}</span>
                                                </td>
                                                <td className="px-4 md:px-8 py-4 md:py-5">
                                                    <span className="text-xs md:text-[13px] font-bold text-titles dark:text-white">
                                                        {new Date(d.date_creation).toLocaleDateString('fr-FR')}
                                                    </span>
                                                </td>
                                                <td className="px-4 md:px-8 py-4 md:py-5">
                                                    <span className={`px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase inline-flex whitespace-nowrap ${
                                                        d.statut === 'en_attente'
                                                            ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20'
                                                            : d.statut === 'approuvé'
                                                            ? 'bg-green-100 text-green-600 dark:bg-green-900/20'
                                                            : 'bg-red-100 text-red-600 dark:bg-red-900/20'
                                                    }`}>
                                                        {d.statut === 'en_attente' ? 'En attente' : d.statut === 'approuvé' ? 'Approuvée' : 'Rejetée'}
                                                    </span>
                                                </td>
                                                <td className="px-4 md:px-8 py-4 md:py-5">
                                                    <div className="flex items-center gap-2">
                                                        <button className="size-8 md:size-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary transition-all flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-[16px] md:text-[18px]">visibility</span>
                                                        </button>
                                                        {d.statut === 'en_attente' && (
                                                            <button 
                                                                onClick={() => handleAnnulerRdv(d.id)}
                                                                className="size-8 md:size-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 transition-all flex items-center justify-center"
                                                            >
                                                                <span className="material-symbols-outlined text-[16px] md:text-[18px]">cancel</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-4 md:px-8 py-8 text-center text-slate-500">
                                                <div className="flex flex-col items-center gap-3">
                                                    <span className="material-symbols-outlined text-[48px] text-slate-300">pending</span>
                                                    <span className="font-medium">Aucune demande en cours</span>
                                                    <span className="text-sm">Cliquez sur "Prendre rendez-vous" pour soumettre une demande</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de demande de rendez-vous */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1c2229] rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Header du modal */}
                        <div className="sticky top-0 bg-gradient-to-r from-primary to-[#35577D] p-6 md:p-8 rounded-t-[2rem]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 md:size-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white text-[28px] md:text-[32px]">calendar_add_on</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-black text-white uppercase italic">Demande de Rendez-vous</h2>
                                        <p className="text-xs md:text-sm text-white/80 font-medium italic">Remplissez les informations ci-dessous</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="size-10 md:size-12 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-all"
                                >
                                    <span className="material-symbols-outlined text-white text-[24px]">close</span>
                                </button>
                            </div>
                        </div>

                        {/* Contenu du modal */}
                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                            {/* Date */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-black text-titles dark:text-white uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-primary text-[20px]">event</span>
                                    Date souhaitée
                                </label>
                                <input
                                    type="date"
                                    name="date_souhaitee"
                                    value={formData.date_souhaitee}
                                    onChange={handleChange}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-titles dark:text-white font-semibold"
                                />
                            </div>

                            {/* Heure */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-black text-titles dark:text-white uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                                    Heure souhaitée
                                </label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-titles dark:text-white font-semibold"
                                />
                            </div>

                            {/* Objet */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-black text-titles dark:text-white uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-primary text-[20px]">title</span>
                                    Objet de la demande
                                </label>
                                <input
                                    type="text"
                                    name="objet"
                                    value={formData.objet}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ex: Consultation générale"
                                    className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-titles dark:text-white font-semibold"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-black text-titles dark:text-white uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-primary text-[20px]">description</span>
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    placeholder="Décrivez brièvement la raison de votre consultation..."
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-titles dark:text-white font-medium resize-none placeholder:text-slate-400"
                                ></textarea>
                            </div>

                            {/* Info */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px] shrink-0">info</span>
                                    <p className="text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                                        Votre demande sera envoyée à nos équipes. Vous recevrez une confirmation par email une fois qu'un médecin aura validé votre rendez-vous.
                                    </p>
                                </div>
                            </div>

                            {/* Boutons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full sm:flex-1 py-4 sm:py-0 sm:h-14 px-6 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-base uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="w-full sm:flex-1 py-4 sm:py-0 sm:h-14 px-6 bg-primary text-white rounded-2xl font-black text-base uppercase tracking-wider shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[22px]">send</span>
                                    Envoyer la demande
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PatientLayout>
    );
};

export default Consultations;
