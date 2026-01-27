import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DoctorLayout from '../../components/layouts/DoctorLayout';
import medicalService from '../../services/medicalService';

const OrdonnancesMedecin = () => {
    const [ordonnances, setOrdonnances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(null); // ID de l'ordonnance en cours de téléchargement

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Récupérer toutes les consultations du médecin
                const response = await medicalService.getAllConsultations();
                const consultations = response.data || [];

                // Filtrer uniquement celles qui ont des prescriptions
                const consultationsAvecOrdonnances = consultations.filter(c =>
                    c.prescriptions && c.prescriptions.length > 0
                );

                setOrdonnances(consultationsAvecOrdonnances.sort((a, b) =>
                    new Date(b.dateH_visite) - new Date(a.dateH_visite)
                ));
            } catch (err) {
                console.error('Erreur chargement ordonnances:', err);
                setError('Impossible de charger les ordonnances.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDownloadPdf = async (consultationId) => {
        try {
            const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/api/consultations/${consultationId}/pdf`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/pdf'
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ordonnance_${consultationId}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                alert('Erreur lors du téléchargement du PDF');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors du téléchargement du PDF');
        }
    };

    return (
        <DoctorLayout>
            <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-primary/10 text-primary rounded-xl material-symbols-outlined text-[20px]">prescriptions</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Archives Prescription</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-titles dark:text-white tracking-tighter leading-none italic uppercase">
                            Ordonnances <span className="text-primary italic">Émises</span>
                        </h1>
                        <p className="text-base text-slate-500 dark:text-slate-400 font-medium italic">Suivez et gérez l'intégralité des prescriptions médicamenteuses délivrées.</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1c2229] border border-slate-100 dark:border-[#2d363f] rounded-[3rem] p-0 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Référence / Date</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Patient Concerné</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Détail Médicamenteux</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">État</th>
                                    <th className="px-8 py-7 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="py-20 text-center">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                                        </td>
                                    </tr>
                                ) : ordonnances.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-20 text-center text-slate-400 font-bold italic">
                                            Aucune ordonnance émise pour le moment.
                                        </td>
                                    </tr>
                                ) : (
                                    ordonnances.map((ord, i) => (
                                        <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-500">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-titles dark:text-white italic tracking-tighter mb-1">ORD-{ord.id}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[14px] text-slate-400">calendar_today</span>
                                                        <span className="text-[10px] font-bold text-slate-400 italic">
                                                            {new Date(ord.dateH_visite).toLocaleDateString('fr-FR')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-black text-xs group-hover:bg-primary group-hover:text-white transition-all">
                                                        {ord.patient?.nom_complet?.charAt(0) || 'P'}
                                                    </div>
                                                    <span className="text-sm font-black text-titles dark:text-white uppercase tracking-tighter italic">
                                                        {ord.patient?.nom_complet || `Patient #${ord.patient_id}`}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="max-w-[300px]">
                                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 italic truncate group-hover:text-titles dark:group-hover:text-white transition-colors">
                                                        {ord.prescriptions.map(p => p.medicament).join(', ') || 'Prescription médicale'}
                                                    </p>
                                                    <span className="text-[9px] font-black text-primary uppercase tracking-widest mt-1 block">
                                                        {ord.prescriptions.length} médicament{ord.prescriptions.length > 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border bg-green-50 text-green-600 border-green-100">
                                                    Validée
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                                    <button
                                                        onClick={() => handleDownloadPdf(ord.id)}
                                                        className="size-11 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-primary transition-all shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center"
                                                        title="Télécharger PDF"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">download</span>
                                                    </button>
                                                    <button
                                                        onClick={() => alert(`Ordonnance #${ord.id}\n\nPatient: ${ord.patient?.nom_complet || 'N/A'}\nMédicaments:\n${ord.prescriptions.map(p => `- ${p.medicament}: ${p.posologie}`).join('\n')}`)}
                                                        className="size-11 rounded-xl bg-primary text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
                                                        title="Voir les détails"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default OrdonnancesMedecin;
