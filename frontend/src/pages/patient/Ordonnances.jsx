import React, { useState } from 'react';
import PatientLayout from '../../components/layouts/PatientLayout';
import { usePrescriptions } from '../../hooks/usePrescriptions';
import Loader from '../../components/ui/Loader';
import Alert from '../../components/ui/Alert';

const Ordonnances = () => {
    const [selectedStatus, setSelectedStatus] = useState('');
    const {
        ordonnancesGrouped,
        loading,
        error,
        downloadPdf,
        clearError,
        hasOrdonnances,
        totalOrdonnances,
        activeOrdonnances,
        expiredOrdonnances,
        cancelledOrdonnances
    } = usePrescriptions();

    const handleDownloadPdf = async (ordonnanceId) => {
        try {
            await downloadPdf(ordonnanceId);
        } catch (err) {
            console.error('Erreur lors du téléchargement:', err);
        }
    };

    const filteredOrdonnances = selectedStatus 
        ? ordonnancesGrouped.filter(ord => ord.statut === selectedStatus)
        : ordonnancesGrouped;

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-600';
            case 'EXPIREE':
                return 'bg-orange-100 text-orange-600';
            case 'ANNULEE':
                return 'bg-red-100 text-red-600';
            default:
                return 'bg-slate-100 text-slate-500';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'Active';
            case 'EXPIREE':
                return 'Expirée';
            case 'ANNULEE':
                return 'Annulée';
            default:
                return status;
        }
    };

    if (loading && ordonnancesGrouped.length === 0) {
        return (
            <PatientLayout>
                <div className="p-8 max-w-[1600px] mx-auto w-full flex justify-center items-center min-h-[400px]">
                    <Loader />
                </div>
            </PatientLayout>
        );
    }

    return (
        <PatientLayout>
            <div className="p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 transition-all duration-[800ms]">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-titles dark:text-white tracking-tight">
                        Mes <span className="text-secondary">Ordonnances</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Consultez et téléchargez vos prescriptions médicales.</p>
                </div>

                {error && (
                    <Alert 
                        type="error" 
                        message={error} 
                        onClose={clearError}
                    />
                )}

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-2xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl">prescriptions</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-titles dark:text-white">{totalOrdonnances}</p>
                                <p className="text-sm text-slate-500">Total</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-2xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl">check_circle</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-titles dark:text-white">{activeOrdonnances}</p>
                                <p className="text-sm text-slate-500">Actives</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-2xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl">schedule</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-titles dark:text-white">{expiredOrdonnances}</p>
                                <p className="text-sm text-slate-500">Expirées</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-2xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl">cancel</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-titles dark:text-white">{cancelledOrdonnances}</p>
                                <p className="text-sm text-slate-500">Annulées</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtres */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedStatus('')}
                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                            selectedStatus === ''
                                ? 'bg-primary text-white'
                                : 'bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] text-slate-600 dark:text-slate-400'
                        }`}
                    >
                        Toutes ({totalOrdonnances})
                    </button>
                    <button
                        onClick={() => setSelectedStatus('ACTIVE')}
                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                            selectedStatus === 'ACTIVE'
                                ? 'bg-green-600 text-white'
                                : 'bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] text-slate-600 dark:text-slate-400'
                        }`}
                    >
                        Actives ({activeOrdonnances})
                    </button>
                    <button
                        onClick={() => setSelectedStatus('EXPIREE')}
                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                            selectedStatus === 'EXPIREE'
                                ? 'bg-orange-600 text-white'
                                : 'bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] text-slate-600 dark:text-slate-400'
                        }`}
                    >
                        Expirées ({expiredOrdonnances})
                    </button>
                    <button
                        onClick={() => setSelectedStatus('ANNULEE')}
                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                            selectedStatus === 'ANNULEE'
                                ? 'bg-red-600 text-white'
                                : 'bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] text-slate-600 dark:text-slate-400'
                        }`}
                    >
                        Annulées ({cancelledOrdonnances})
                    </button>
                </div>

                {/* Liste des ordonnances */}
                {hasOrdonnances ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOrdonnances.map((ordonnance) => (
                            <div key={ordonnance.numero} className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl">prescriptions</span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusColor(ordonnance.statut)}`}>
                                        {getStatusText(ordonnance.statut)}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1 mb-6">
                                    <h3 className="text-lg font-black text-titles dark:text-white">{ordonnance.numero}</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                                        {ordonnance.medecin ? `Dr. ${ordonnance.medecin.nom} ${ordonnance.medecin.prenom}` : 'Médecin non spécifié'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-transparent">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                                        <p className="text-sm font-bold text-titles dark:text-white">
                                            {new Date(ordonnance.date).toLocaleDateString('fr-FR', { 
                                                day: 'numeric', 
                                                month: 'short', 
                                                year: 'numeric' 
                                            })}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-transparent">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Médicaments</p>
                                        <p className="text-sm font-bold text-titles dark:text-white">{ordonnance.medicaments.length}</p>
                                    </div>
                                </div>

                                {/* Liste des médicaments */}
                                {ordonnance.medicaments.length > 0 && (
                                    <div className="mb-6">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Médicaments</p>
                                        <div className="space-y-1">
                                            {ordonnance.medicaments.slice(0, 2).map((medicament, index) => (
                                                <p key={index} className="text-xs text-slate-600 dark:text-slate-400">
                                                    • {medicament.nom} ({medicament.dosage})
                                                </p>
                                            ))}
                                            {ordonnance.medicaments.length > 2 && (
                                                <p className="text-xs text-slate-500">
                                                    +{ordonnance.medicaments.length - 2} autre(s)...
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <button 
                                    onClick={() => handleDownloadPdf(ordonnance.medicaments[0]?.id)}
                                    disabled={loading}
                                    className="w-full h-12 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-xs hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="material-symbols-outlined text-[18px]">download</span>
                                    {loading ? 'Téléchargement...' : 'Télécharger PDF'}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="size-20 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-4xl">prescriptions</span>
                        </div>
                        <h3 className="text-xl font-bold text-titles dark:text-white mb-2">Aucune ordonnance</h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            {selectedStatus ? `Aucune ordonnance ${getStatusText(selectedStatus).toLowerCase()}` : 'Vous n\'avez aucune ordonnance pour le moment'}
                        </p>
                    </div>
                )}
            </div>
        </PatientLayout>
    );
};

export default Ordonnances;
