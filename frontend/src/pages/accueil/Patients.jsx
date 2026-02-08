import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReceptionLayout from '../../components/layouts/ReceptionLayout';
import accueilService from '../../services/accueil/accueilService';

const ListePatients = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [patients, setPatients] = useState([]);
    const [sortOrder, setSortOrder] = useState('DESC'); // 'ASC' ou 'DESC'
    const [filterType, setFilterType] = useState('Tous'); // 'Tous', 'Adulte', 'Enfant'
    const [sortBy, setSortBy] = useState('id'); // 'id', 'nom'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    useEffect(() => {
    const fetchPatients = async () => {
        try {
            setLoading(true);
            // Le service renvoie directement le tableau mappé
            const data = await accueilService.getPatients();
            
            // On vérifie simplement si c'est un tableau
            if (Array.isArray(data)) {
                setPatients(data);
            } else {
                setPatients([]);
            }
        } catch (err) {
            console.error("Erreur lors du chargement:", err);
            setError('Erreur lors du chargement des patients');
        } finally {
            setLoading(false);
        }
    };
    fetchPatients();
}, []);

    // Logique de filtrage et tri
   const filteredAndSortedPatients = patients
    .filter(patient => {
        const searchLower = search.toLowerCase();
        // Plus besoin de vérifier NOM ou PRENOM en majuscules, le service a tout uniformisé
        const fullName = `${patient.nom} ${patient.prenom}`.toLowerCase();
        const matchesSearch = (
            fullName.includes(searchLower) ||
            patient.id.toString().includes(searchLower) ||
            patient.tel.includes(searchLower)
        );

        const matchesType = filterType === 'Tous' || 
                           patient.type === (filterType === 'Adulte' ? 'Autonome' : filterType);

        return matchesSearch && matchesType;
    })
        .sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'id') {
                comparison = parseInt(a.id) - parseInt(b.id);
            } else if (sortBy === 'nom') {
                const nameA = (a.nom || a.NOM || '').toLowerCase();
                const nameB = (b.nom || b.NOM || '').toLowerCase();
                comparison = nameA.localeCompare(nameB);
            }
            return sortOrder === 'DESC' ? -comparison : comparison;
        });

    const handleEdit = (id) => {
        navigate(`/accueil/patients/edit/${id}`);
    };

    return (
        <ReceptionLayout>
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6 md:gap-8 transition-all duration-[800ms]">
                <div className="mb-2 md:mb-4 text-titles dark:text-white">
                    <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase">
                        Gestion des Dossiers Patients
                    </h1>
                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium italic mt-2">
                        Consultez, modifiez et créez les dossiers médicaux de la clinique.
                    </p>
                </div>

                <div className="flex flex-col gap-5">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
                            <input
                                type="text"
                                placeholder="Rechercher par nom, ID ou téléphone..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-14 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-2xl pl-12 pr-6 text-sm font-bold text-titles dark:text-white outline-none focus:border-primary/50 transition-all shadow-sm"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setSortOrder(prev => prev === 'DESC' ? 'ASC' : 'DESC')}
                                className="h-14 px-6 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] text-titles dark:text-white rounded-2xl flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm group"
                            >
                                <span className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${sortOrder === 'DESC' ? '' : 'rotate-180'}`}>
                                    straight
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                    {sortOrder}
                                </span>
                            </button>

                            <Link to="/accueil/enregistrement" className="h-14 px-8 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:translate-y-[-2px] active:translate-y-[0px] transition-all flex items-center justify-center gap-3">
                                <span className="material-symbols-outlined text-[20px]">person_add</span>
                                Nouveau Patient
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Options:</span>
                            <div className="flex flex-wrap bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] p-1 rounded-xl shadow-sm gap-1">
                                <div className="flex gap-1 border-r border-slate-100 dark:border-slate-800 pr-1 mr-1">
                                    {['Tous', 'Adulte', 'Enfant'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setFilterType(type)}
                                            className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filterType === type
                                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                : 'text-slate-400 hover:text-titles dark:hover:text-white'}`}
                                        >
                                            {type === 'Tous' ? 'Tous' : type === 'Adulte' ? 'Autonomes' : 'Enfants'}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-1">
                                    {['id', 'nom'].map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => setSortBy(key)}
                                            className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${sortBy === key
                                                ? 'bg-slate-100 dark:bg-slate-800 text-primary shadow-sm'
                                                : 'text-slate-400 hover:text-titles dark:hover:text-white'}`}
                                        >
                                            {key === 'id' ? 'Date / ID' : 'Nom'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-600 dark:text-red-400 text-sm font-medium text-center">
                        {error}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Patient / ID</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Type</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Contact / Tuteur</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Visite</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {filteredAndSortedPatients.length > 0 ? (
                                        filteredAndSortedPatients.map((patient) => {
                                            const nom = patient.nom || patient.NOM || '—';
                                            const prenom = patient.prenom || patient.PRENOM || '';
                                            const telephone = patient.tel || patient.telephone || patient.TEL || 'N/A';
                                            const type = patient.type || patient.TYPE || 'Adulte';

                                            return (
                                                <tr key={patient.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs uppercase">
                                                                {nom[0]}{prenom[0]}
                                                            </div>
                                                            <div className="flex flex-col leading-none">
                                                                <span className="text-sm font-black text-titles dark:text-white uppercase tracking-tight mb-1">
                                                                    {nom} {prenom}
                                                                </span>
                                                                <span className="text-[10px] text-slate-400 font-bold tracking-widest italic">ID: {patient.id}</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-8 py-6">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${type.toLowerCase().includes('enf')
                                                            ? 'bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
                                                            : 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                                                        }`}>
                                                            {type}
                                                        </span>
                                                    </td>

                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                                                {telephone}
                                                            </span>
                                                            {(patient.whatsapp === 1 || patient.whatsapp === true) && (
                                                                <span className="text-[10px] text-green-500 font-medium flex items-center gap-1">
                                                                    <span className="material-symbols-outlined text-[12px]">chat</span> WhatsApp
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                                                {patient.derniere_visite ? new Date(patient.derniere_visite).toLocaleDateString('fr-FR') : 'Nouveau'}
                                                            </span>
                                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                                                Dernier RDV
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            {/* <Link
                                                                to={`/accueil/patients/${patient.id}`}
                                                                className="p-2 hover:bg-primary/10 text-slate-400 hover:text-primary rounded-lg transition-all"
                                                                title="Voir le dossier"
                                                            >
                                                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                            </Link> */}
                                                            <button
                                                                onClick={() => handleEdit(patient.id)}
                                                                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-400 hover:text-blue-500 rounded-lg transition-all"
                                                                title="Modifier le patient"
                                                            >
                                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-12 text-center text-slate-400 font-bold italic uppercase tracking-widest">
                                                Aucun patient trouvé
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Section Statistiques */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 rounded-[2rem] bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-900/10 text-blue-600 flex items-center justify-center">
                            <span className="material-symbols-outlined">group</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-titles dark:text-white">{patients.length}</span>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Total Patients</span>
                        </div>
                    </div>

                    <div className="p-6 rounded-[2rem] bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-green-50 dark:bg-green-900/10 text-green-600 flex items-center justify-center">
                            <span className="material-symbols-outlined">person_check</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-titles dark:text-white">
                                {patients.filter(p => (p.type || p.TYPE || '').toLowerCase().includes('adul')).length}
                            </span>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Autonomes</span>
                        </div>
                    </div>

                    <div className="p-6 rounded-[2rem] bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 flex items-center justify-center">
                            <span className="material-symbols-outlined">family_restroom</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-titles dark:text-white">
                                {patients.filter(p => (p.type || p.TYPE || '').toLowerCase().includes('enf')).length}
                            </span>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Enfants</span>
                        </div>
                    </div>

                    <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary to-[#35577D] border-none shadow-lg shadow-primary/20 flex items-center gap-4 text-white">
                        <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <span className="material-symbols-outlined">verified</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black italic">
                                {patients.length > 0 ? '100%' : '0%'}
                            </span>
                            <span className="text-[10px] font-black uppercase text-white/70 tracking-widest leading-none">Dossiers Vérifiés</span>
                        </div>
                    </div>
                </div> */}

            </div>
        </ReceptionLayout>
    );
};

export default ListePatients;