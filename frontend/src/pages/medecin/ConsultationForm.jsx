import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DoctorLayout from '../../components/layouts/DoctorLayout';
import medicalService from '../../services/medicalService';

const ConsultationForm = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const rdvId = searchParams.get('rdv_id');
    const patientId = searchParams.get('patient_id');

    const [formLoading, setFormLoading] = useState(false);
    const [consultationData, setConsultationData] = useState({
        motif: '',
        diagnostic: '',
        examen_physique: '',
        traitement: '',
        observations_medecin: '',
        antecedents: '',
        allergies: '',
        prix: 0,
    });

    const [prescriptions, setPrescriptions] = useState([{ nom_medicament: '', dosage: '', instructions: '' }]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setConsultationData(prev => ({ ...prev, [name]: value }));
    };

    const handlePrescriptionChange = (index, field, value) => {
        const updated = [...prescriptions];
        updated[index][field] = value;
        setPrescriptions(updated);
    };

    const addPrescriptionRow = () => {
        setPrescriptions([...prescriptions, { nom_medicament: '', dosage: '', instructions: '' }]);
    };

    const removePrescriptionRow = (index) => {
        if (prescriptions.length > 1) {
            setPrescriptions(prescriptions.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const medecinId = currentUser?.id;

            // 1. Créer la consultation
            const consultPayload = {
                ...consultationData,
                patient_id: patientId,
                medecin_id: medecinId,
                rdv_id: rdvId,
                dateH_visite: new Date().toISOString().slice(0, 19).replace('T', ' '),
            };

            const response = await medicalService.createConsultation(consultPayload);
            const consultationId = response.data.id;

            // 2. Ajouter les prescriptions
            const validPrescriptions = prescriptions.filter(p => p.nom_medicament.trim() !== '');
            if (validPrescriptions.length > 0) {
                await Promise.all(validPrescriptions.map(p =>
                    medicalService.addPrescription(consultationId, { ...p, medecin_id: medecinId })
                ));
            }

            alert('Consultation enregistrée avec succès !');
            navigate('/medecin'); // Retour au dashboard

        } catch (err) {
            console.error('Erreur enregistrement:', err);
            alert('Une erreur est survenue lors de l\'enregistrement.');
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <DoctorLayout>
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full flex flex-col gap-8 transition-all animate-in fade-in">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black text-titles dark:text-white italic uppercase tracking-tighter">
                        Nouvelle Consultation
                    </h1>
                    <p className="text-slate-500 font-medium italic">Saisie du diagnostic et de l'ordonnance pour le patient #{patientId}</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Diagnostic Info */}
                    <div className="bg-white dark:bg-[#1c2229] p-8 rounded-[2.5rem] border border-slate-200 dark:border-[#2d363f] shadow-sm flex flex-col gap-6">
                        <h3 className="text-lg font-black text-titles dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">analytics</span>
                            Diagnostic & Observations
                        </h3>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black uppercase text-slate-400">Motif de la visite</label>
                                <textarea name="motif" value={consultationData.motif} onChange={handleInputChange} className="p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl resize-none min-h-[80px] focus:ring-2 ring-primary/20 transition-all font-medium text-sm" placeholder="Pourquoi le patient consulte ?" required />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black uppercase text-slate-400">Diagnostic</label>
                                <textarea name="diagnostic" value={consultationData.diagnostic} onChange={handleInputChange} className="p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl resize-none min-h-[100px] focus:ring-2 ring-primary/20 transition-all font-medium text-sm" placeholder="Conclusion médicale" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Antécédents</label>
                                    <textarea name="antecedents" value={consultationData.antecedents} onChange={handleInputChange} className="p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl resize-none min-h-[100px] focus:ring-2 ring-primary/20 transition-all font-medium text-sm" placeholder="Historique patient" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Allergies</label>
                                    <textarea name="allergies" value={consultationData.allergies} onChange={handleInputChange} className="p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl resize-none min-h-[100px] focus:ring-2 ring-primary/20 transition-all font-medium text-sm" placeholder="Contre-indications" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Prescription Part */}
                    <div className="bg-white dark:bg-[#1c2229] p-8 rounded-[2.5rem] border border-slate-200 dark:border-[#2d363f] shadow-sm flex flex-col gap-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-black text-titles dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">prescriptions</span>
                                Ordonnance
                            </h3>
                            <button type="button" onClick={addPrescriptionRow} className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <span className="material-symbols-outlined">add</span>
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {prescriptions.map((p, i) => (
                                <div key={i} className="p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl relative group border border-transparent hover:border-primary/20 transition-all">
                                    <div className="grid grid-cols-1 gap-3">
                                        <input type="text" value={p.nom_medicament} onChange={(e) => handlePrescriptionChange(i, 'nom_medicament', e.target.value)} className="w-full bg-transparent border-none p-0 font-bold text-titles dark:text-white placeholder:text-slate-400 text-sm focus:ring-0" placeholder="Nom du médicament" required />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="text" value={p.dosage} onChange={(e) => handlePrescriptionChange(i, 'dosage', e.target.value)} className="bg-white dark:bg-slate-800 rounded-xl px-3 py-2 text-xs font-bold border-none focus:ring-1 ring-primary/30" placeholder="Ex: 500mg" required />
                                            <input type="text" value={p.instructions} onChange={(e) => handlePrescriptionChange(i, 'instructions', e.target.value)} className="bg-white dark:bg-slate-800 rounded-xl px-3 py-2 text-xs font-medium border-none focus:ring-1 ring-primary/30" placeholder="Ex: 1 matin/soir" />
                                        </div>
                                    </div>
                                    {prescriptions.length > 1 && (
                                        <button type="button" onClick={() => removePrescriptionRow(i)} className="absolute -top-2 -right-2 size-7 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto border-t border-slate-100 dark:border-slate-800 pt-6">
                            <button type="submit" disabled={formLoading} className="w-full h-16 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70">
                                {formLoading ? 'Enregistrement...' : (
                                    <>
                                        Valider la consultation
                                        <span className="material-symbols-outlined animate-bounce-x">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </DoctorLayout>
    );
};

export default ConsultationForm;
