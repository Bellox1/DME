import React, { useState, useEffect } from 'react';
import DoctorLayout from '../../components/layouts/DoctorLayout';
import medicalService from '../../services/medicalService';

const ResultatsMedecin = () => {
    const [resultats, setResultats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'Labo', 'Imagerie'

    useEffect(() => {
        const fetchResultats = async () => {
            try {
                setLoading(true);
                const response = await medicalService.getResultats();
                setResultats(response.data || []);
            } catch (err) {
                console.error('Erreur chargement résultats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchResultats();
    }, []);

    const filteredResultats = filter === 'all'
        ? resultats
        : resultats.filter(r => r.type === filter);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Aujourd'hui";
        if (diffDays === 1) return "Hier";
        return date.toLocaleDateString('fr-FR');
    };

    return (
        <DoctorLayout>
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6 md:gap-8 transition-all duration-[800ms]">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase transition-all">Analyses & Résultats</h1>
                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium italic">Consultez les bilans biologiques et examens d'imagerie.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                    <div className="lg:col-span-12">
                        <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                                <h3 className="text-lg md:text-xl font-black text-titles dark:text-white italic uppercase">Documents Récents</h3>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={() => setFilter('all')}
                                        className={`flex-1 sm:flex-none h-10 px-4 md:px-6 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border ${filter === 'all' ? 'bg-primary/10 text-primary border-primary/10' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-800'}`}
                                    >
                                        Tous
                                    </button>
                                    <button
                                        onClick={() => setFilter('Labo')}
                                        className={`flex-1 sm:flex-none h-10 px-4 md:px-6 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border ${filter === 'Labo' ? 'bg-primary/10 text-primary border-primary/10' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-800'}`}
                                    >
                                        Labo
                                    </button>
                                    <button
                                        onClick={() => setFilter('Imagerie')}
                                        className={`flex-1 sm:flex-none h-10 px-4 md:px-6 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border ${filter === 'Imagerie' ? 'bg-primary/10 text-primary border-primary/10' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-800'}`}
                                    >
                                        Imagerie
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                </div>
                            ) : filteredResultats.length === 0 ? (
                                <div className="text-center py-20 text-slate-400 italic">
                                    Aucun résultat d'examen disponible pour le moment.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                    {filteredResultats.map((doc, i) => (
                                        <div key={i} className="p-5 md:p-6 rounded-2xl md:rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all cursor-pointer group">
                                            <div className="flex items-center gap-3 md:gap-4 mb-4">
                                                <div className="size-11 md:size-12 shrink-0 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                                                    <span className="material-symbols-outlined text-[22px] md:text-[24px]">description</span>
                                                </div>
                                                <div className="flex flex-col flex-1 min-w-0">
                                                    <span className="text-sm font-black text-titles dark:text-white uppercase tracking-tighter truncate">
                                                        {doc.patient?.nom_complet || `Patient #${doc.patient_id}`}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 italic">{formatDate(doc.date_examen)}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <p className="text-xs font-bold text-titles dark:text-white truncate">{doc.titre}</p>
                                                <div className="flex justify-between items-center gap-2">
                                                    <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded whitespace-nowrap ${doc.statut === 'À valider' ? 'bg-amber-100 text-amber-600' :
                                                            doc.statut === 'Anormal' ? 'bg-rose-100 text-rose-600' :
                                                                'bg-primary/10 text-primary'
                                                        }`}>
                                                        {doc.statut}
                                                    </span>
                                                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-all text-[20px]">download</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default ResultatsMedecin;
