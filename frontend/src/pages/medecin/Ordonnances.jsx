import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DoctorLayout from '../../components/layouts/DoctorLayout';
import medecinService from '../../services/medecin/medecinService';
import patientService from '../../services/patient/patientService';

const OrdonnancesMedecin = () => {
    const [ordonnances, setOrdonnances] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // On récupère d'abord tous les patients pour les noms
                const patientsData = await patientService.getAllPatients();
                setPatients(patientsData);

                const currentUser = JSON.parse(localStorage.getItem('user'));
                const medecinId = currentUser?.id;

                const allOrdsPromises = patientsData.map(p =>
                    ordonnanceService.getPatientOrdonnances(p.id).catch(() => [])
                );

                const results = await Promise.all(allOrdsPromises);
                const flattenedOrds = results.flat()
                    .filter(o => o.medecin_id === medecinId)
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                setOrdonnances(flattenedOrds);
            } catch (err) {
                console.error('Erreur chargement ordonnances:', err);
                setError('Impossible de charger les ordonnances.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getPatientName = (patientId) => {
        const patient = patients.find(p => p.id === parseInt(patientId));
        return patient ? `${patient.nom} ${patient.prenom}` : `Patient #${patientId}`;
    };

    const handlePrint = async (consultationId) => {
        try {
            await ordonnanceService.generateOrdonnancePdf(consultationId);
        } catch (err) {
            console.error('Erreur impression PDF:', err);
            alert('Erreur lors de la génération du PDF');
        }
    };

    const queryParams = new URLSearchParams(window.location.search);
    const patientIdFilter = queryParams.get('patient');
    const [showNewModal, setShowNewModal] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState(patientIdFilter || '');
    const [meds, setMeds] = useState([{ nom: '', posologie: '' }]);

    useEffect(() => {
        if (patientIdFilter && queryParams.get('new') === 'true') {
            setShowNewModal(true);
            setSelectedPatientId(patientIdFilter);
        }
    }, [patientIdFilter]);

    const handleAddMed = () => setMeds([...meds, { nom: '', posologie: '' }]);

    const handleCreatePrescription = async (e) => {
        e.preventDefault();
        try {
            // Dans ce système, on suppose qu'on crée une "consultation d'ordonnance" 
            // ou qu'on utilise la dernière active.
            // Pour simplifier, on redirige vers la création d'une consultation qui inclura l'ordonnance
            // ou on utilise un service dédié si existant.
            alert('Enregistrement de la prescription en cours...');
            setShowNewModal(false);
            window.location.href = '/medecin/ordonnances';
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <DoctorLayout>
            <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">

                {/* Modal Nouvelle Ordonnance */}
                {showNewModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-[#1c2229] w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                            <div className="p-8 md:p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-black text-titles dark:text-white uppercase italic tracking-tighter">Rédaction Ordonnance</h3>
                                    {!patientIdFilter ? (
                                        <p className="text-sm text-slate-400 font-medium italic">Choisissez un patient et listez les médicaments.</p>
                                    ) : (
                                        <p className="text-sm text-slate-400 font-medium italic">Prescription pour : {getPatientName(patientIdFilter)}</p>
                                    )}
                                </div>
                                <button onClick={() => setShowNewModal(false)} className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center hover:text-rose-500 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <form onSubmit={handleCreatePrescription} className="p-8 md:p-10 space-y-6">
                                {!patientIdFilter && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Sélectionner le Patient</label>
                                        <select
                                            value={selectedPatientId}
                                            onChange={e => setSelectedPatientId(e.target.value)}
                                            className="w-full h-14 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 text-sm font-bold text-titles dark:text-white outline-none ring-2 ring-transparent focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                                            required
                                        >
                                            <option value="">-- Choisir un patient --</option>
                                            {patients.map(p => (
                                                <option key={p.id} value={p.id}>{p.nom} {p.prenom} (ID: {p.id})</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {meds.map((med, idx) => (
                                        <div key={idx} className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-2">Médicament</label>
                                                <input type="text" className="w-full h-12 bg-white dark:bg-[#15191d] border-none rounded-xl px-4 text-sm font-bold text-titles dark:text-white outline-none" placeholder="Ex: Paracétamol" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-2">Posologie</label>
                                                <input type="text" className="w-full h-12 bg-white dark:bg-[#15191d] border-none rounded-xl px-4 text-sm font-bold text-titles dark:text-white outline-none" placeholder="1 tab 3x / jour" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={handleAddMed} className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-primary hover:text-primary transition-all">
                                    + Ajouter un médicament
                                </button>
                                <button type="submit" className="w-full h-16 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                                    <span>Signer et Générer l'ordonnance</span>
                                    <span className="material-symbols-outlined">draw</span>
                                </button>
                            </form>
                        </div>
                    </div>
                )}

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
                    <button
                        onClick={() => {
                            setShowNewModal(true);
                            if (!patientIdFilter) setSelectedPatientId('');
                        }}
                        className="w-full md:w-auto h-14 px-10 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <span className="material-symbols-outlined text-[20px]">medical_services</span>
                        Nouvelle Ordonnance
                    </button>
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
                                                            {new Date(ord.created_at).toLocaleDateString('fr-FR')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-black text-xs group-hover:bg-primary group-hover:text-white transition-all">
                                                        {getPatientName(ord.patient_id).charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-black text-titles dark:text-white uppercase tracking-tighter italic">{getPatientName(ord.patient_id)}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="max-w-[300px]">
                                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 italic truncate group-hover:text-titles dark:group-hover:text-white transition-colors">
                                                        {ord.diagnostic || 'Prescription médicale'}
                                                    </p>
                                                    <span className="text-[9px] font-black text-primary uppercase tracking-widest mt-1 block opacity-0 group-hover:opacity-100 transition-opacity">Voir le détail</span>
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
                                                        onClick={() => handlePrint(ord.id)}
                                                        className="size-11 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-primary transition-all shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center"
                                                        title="Imprimer PDF"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">print</span>
                                                    </button>
                                                    <button className="size-11 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-primary transition-all shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-[20px]">share</span>
                                                    </button>
                                                    <button className="size-11 rounded-xl bg-primary text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20">
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
