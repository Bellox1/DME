import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DoctorLayout from '../../components/layouts/DoctorLayout';
import medecinService from '../../services/medecin/medecinService';

const ListePatientsMedecin = () => {
    const [search, setSearch] = useState('');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                const data = await medecinService.searchPatients('');
                // Data might be paginated { data: [...] } or array [...]
                setPatients(data.data || data);
            } catch (err) {
                setError('Erreur lors du chargement des patients');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    return (
        <DoctorLayout>
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-primary/10 text-primary rounded-xl material-symbols-outlined text-[20px]">groups</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Base de Données Clinique</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-titles dark:text-white tracking-tighter leading-none italic uppercase">
                            Mes <span className="text-primary italic">Patients</span>
                        </h1>
                        <p className="text-base text-slate-500 dark:text-slate-400 font-medium italic">Consultez et gérez les dossiers médicaux de l'ensemble de votre patientèle.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 sm:min-w-[400px]">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-[22px]">search</span>
                            <input
                                type="text"
                                placeholder="Rechercher par nom, ID, téléphone..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-14 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-2xl pl-12 pr-6 text-sm font-bold text-titles dark:text-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                            />
                        </div>
                        <button className="h-14 px-8 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] text-titles dark:text-white rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                            <span className="material-symbols-outlined text-[20px]">filter_list</span>
                            <span className="text-[11px] font-black uppercase tracking-widest">Filtres</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <div className="relative">
                            <div className="size-16 rounded-full border-4 border-primary/10 border-t-primary animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-[24px] animate-pulse">group</span>
                            </div>
                        </div>
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] italic">Chargement des dossiers...</p>
                    </div>
                ) : error ? (
                    <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 rounded-[2.5rem] p-8 text-rose-600 dark:text-rose-400 text-sm font-bold italic flex items-center gap-4">
                        <span className="material-symbols-outlined text-[28px]">error</span>
                        {error}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-[#1c2229] border border-slate-100 dark:border-[#2d363f] rounded-[3rem] overflow-hidden shadow-sm relative">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[1000px]">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-8 py-7 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Identité du Patient</th>
                                        <th className="px-8 py-7 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Données Baseline</th>
                                        <th className="px-8 py-7 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Contact & Liaison</th>
                                        <th className="px-8 py-7 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Statut Médical</th>
                                        <th className="px-8 py-7 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {patients.filter(p =>
                                        !search ||
                                        `${p.nom} ${p.prenom}`.toLowerCase().includes(search.toLowerCase()) ||
                                        p.id.toString().includes(search)
                                    ).map((patient) => (
                                        <tr key={patient.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-500">
                                            <td className="px-8 py-7">
                                                <div className="flex items-center gap-5">
                                                    <div className="size-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-primary font-black text-lg shadow-inner group-hover:scale-110 transition-transform">
                                                        {patient.nom ? patient.nom[0] : 'P'}{patient.prenom ? patient.prenom[0] : ''}
                                                    </div>
                                                    <div className="flex flex-col leading-none">
                                                        <span className="text-base font-black text-titles dark:text-white uppercase tracking-tighter mb-1 italic">
                                                            {patient.nom} {patient.prenom}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em]">DOSSIER #{patient.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[16px] text-slate-400 italic">cake</span>
                                                        <span className="text-xs font-bold text-titles dark:text-white italic">
                                                            {patient.age ? `${patient.age} ans` : 'Âge non renseigné'}
                                                        </span>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest w-fit ${patient.sexe === 'M' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                                                        {patient.sexe === 'M' ? 'Masculin' : 'Féminin'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[11px] font-black text-slate-600 dark:text-slate-400 italic underline decoration-primary/20">{patient.tel || 'Aucun contact'}</span>
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Canal Téléphonique</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7">
                                                <div className="flex flex-col gap-2">
                                                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest w-fit border ${patient.type === 'Adulte'
                                                        ? 'bg-green-50 text-green-600 border-green-100'
                                                        : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                                                        {patient.type === 'Adulte' ? 'Patient Autonome' : 'Pédiatrie'}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="size-2 rounded-full bg-green-500"></span>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Dossier à jour</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7 text-right">
                                                <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                                    <Link
                                                        to={`/medecin/consultations?patient=${patient.id}`}
                                                        className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm border border-primary/20"
                                                        title="Historique des consultations"
                                                    >
                                                        <span className="material-symbols-outlined text-[24px]">history</span>
                                                    </Link>
                                                    <Link
                                                        to={`/medecin/consultations?new=true&patient=${patient.id}`}
                                                        className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-primary/20"
                                                        title="Nouvelle Consultation"
                                                    >
                                                        <span className="material-symbols-outlined text-[24px]">stethoscope</span>
                                                    </Link>
                                                    <Link
                                                        to={`/medecin/ordonnances?new=true&patient=${patient.id}`}
                                                        className="size-12 rounded-2xl bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700 flex items-center justify-center hover:text-primary transition-all"
                                                        title="Nouvelle Ordonnance"
                                                    >
                                                        <span className="material-symbols-outlined text-[24px]">prescriptions</span>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </DoctorLayout>
    );
};

export default ListePatientsMedecin;
