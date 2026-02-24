import React, { useState, useEffect } from 'react';
import medecinService from '../../services/medecin/medecinService';

const TransferModal = ({ patient, isOpen, onClose, onTransferComplete }) => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [motif, setMotif] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingDoctors, setFetchingDoctors] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchDoctors();
            setSuccess(false);
            setError('');
            setSelectedDoctor('');
            setMotif('');
        }
    }, [isOpen]);

    const fetchDoctors = async () => {
        try {
            setFetchingDoctors(true);
            const response = await medecinService.getDoctorsForTransfer();
            if (response.success) {
                setDoctors(response.data);
            }
        } catch (err) {
            console.error("Erreur lors de la récupération des médecins:", err);
            setError("Impossible de charger la liste des médecins.");
        } finally {
            setFetchingDoctors(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDoctor) {
            setError("Veuillez choisir un médecin destinataire.");
            return;
        }

        try {
            setLoading(true);
            setError('');
            const response = await medecinService.createTransfer({
                patient_id: patient.id,
                medecin_destinataire_id: selectedDoctor,
                motif: motif
            });

            if (response.success) {
                setSuccess(true);
                setTimeout(() => {
                    onTransferComplete();
                    onClose();
                }, 2000);
            }
        } catch (err) {
            console.error("Erreur lors du transfert:", err);
            setError(err.response?.data?.message || "Une erreur est survenue lors du transfert.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#1c2229] rounded-[3rem] shadow-2xl border border-slate-200 dark:border-[#2d363f] max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="relative p-8 pb-6 border-b border-slate-50 dark:border-[#252c35] overflow-hidden">
                    <div className="absolute top-0 right-0 size-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined">move_up</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-titles dark:text-white uppercase italic tracking-tight">Transférer le dossier</h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Patient: {patient?.nom_complet}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="size-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-all flex items-center justify-center"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                {success ? (
                    <div className="p-12 text-center flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
                        <div className="size-20 bg-green-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-green-500/20">
                            <span className="material-symbols-outlined text-4xl">check_circle</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-titles dark:text-white uppercase italic mb-2">Transfert Réussi</h3>
                            <p className="text-sm text-slate-400 font-bold italic">Le dossier a été transféré avec succès.</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Doctor Selection */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] pl-1">
                                Sélectionner le médecin destinataire
                            </label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">
                                    medical_services
                                </span>
                                <select
                                    value={selectedDoctor}
                                    onChange={(e) => setSelectedDoctor(e.target.value)}
                                    className="w-full h-16 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl pl-14 pr-6 text-sm font-bold text-titles dark:text-white transition-all outline-none appearance-none cursor-pointer"
                                    required
                                    disabled={fetchingDoctors}
                                >
                                    <option value="">{fetchingDoctors ? 'Chargement...' : 'Choisir un collègue...'}</option>
                                    {doctors.map(doc => (
                                        <option key={doc.id} value={doc.id}>
                                            Dr. {doc.nom} {doc.prenom}
                                        </option>
                                    ))}
                                </select>
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 pointer-events-none">
                                    expand_more
                                </span>
                            </div>
                        </div>

                        {/* Motif / Message */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] pl-1">
                                Motif ou Message d'accompagnement
                            </label>
                            <div className="relative group">
                                <span className="absolute left-5 top-6 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">
                                    description
                                </span>
                                <textarea
                                    value={motif}
                                    onChange={(e) => setMotif(e.target.value)}
                                    placeholder="Ex: Demande d'avis spécialisé, suite de traitement..."
                                    className="w-full min-h-[120px] bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-3xl pl-14 pr-6 py-5 text-sm font-bold text-titles dark:text-white transition-all outline-none resize-none"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/40 flex items-center gap-3 animate-in shake duration-500">
                                <span className="material-symbols-outlined text-rose-500 text-[20px]">error</span>
                                <p className="text-[11px] font-black uppercase tracking-tight text-rose-500">{error}</p>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !selectedDoctor}
                                className="flex-[2] h-14 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
                            >
                                {loading ? (
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                ) : (
                                    <>
                                        Confirmer le transfert
                                        <span className="material-symbols-outlined">send</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default TransferModal;
