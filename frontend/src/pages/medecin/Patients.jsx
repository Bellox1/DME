import React, { useState, useEffect } from 'react';
import DoctorLayout from '../../components/layouts/DoctorLayout';
import { patientService } from '../../services';

const ListePatientsMedecin = () => {
    const [search, setSearch] = useState('');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                const data = await patientService.getAllPatients();
                setPatients(data);
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
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 transition-all duration-[800ms]">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase transition-all">Ma File Patients</h1>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium italic">Accédez aux dossiers médicaux de vos patients.</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary">search</span>
                        <input
                            type="text"
                            placeholder="Rechercher par nom, ID ou pathologie..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-14 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-2xl pl-12 pr-6 text-sm font-bold text-titles dark:text-white outline-none focus:border-primary/50 transition-all font-display"
                        />
                    </div>
                    <button className="h-14 px-8 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined">filter_list</span>
                        Filtres Avancés
                    </button>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-600 dark:text-red-400 text-sm font-medium">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[900px]">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-6 md:px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Patient / ID</th>
                                        <th className="px-6 md:px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Infos Baseline</th>
                                        <th className="px-6 md:px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Dérnière Visite</th>
                                        <th className="px-6 md:px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Spécialité/Dossier</th>
                                        <th className="px-6 md:px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Dossier</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {patients.map((patient) => (
                                        <tr key={patient.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col leading-none">
                                                    <span className="text-sm font-black text-titles dark:text-white uppercase tracking-tighter mb-1">{patient.nom_complet || 'Patient Inconnu'}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold tracking-widest">P-{patient.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                                                        {patient.utilisateur?.date_naissance ? 
                                                            `${new Date().getFullYear() - new Date(patient.utilisateur.date_naissance).getFullYear()} ans` : 
                                                            'Âge non spécifié'
                                                        }
                                                    </span>
                                                    <span className="text-[10px] font-black text-primary/70">
                                                        {patient.utilisateur?.sexe || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-xs font-black text-titles dark:text-white italic">
                                                    {patient.date_modification ? new Date(patient.date_modification).toLocaleDateString('fr-FR') : 'Jamais'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase border border-primary/10">
                                                    {patient.utilisateur_id ? 'Adulte' : 'Pédiatrie'}
                                                </span>
                                            </td>
                                            <td className="px-6 md:px-8 py-6 text-right">
                                                <button className="h-10 px-6 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm border border-primary/10">
                                                    Ouvrir Dossier
                                                </button>
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
