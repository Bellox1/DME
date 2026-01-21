import React, { useState } from 'react';
import ReceptionLayout from '../../components/layouts/ReceptionLayout';

const EnregistrementPatient = () => {
    const [step, setStep] = useState(1);
    const [patientType, setPatientType] = useState('autonome'); // 'autonome' or 'dependant'

    // Form state
    const [formData, setFormData] = useState({
        // User (Account) Info
        nom: '',
        prenom: '',
        tel: '',
        whatsapp: '',
        mot_de_passe: '',
        sexe: 'Homme',
        est_tuteur: false,

        // Patient (Medical) Info
        taille: '',
        poids: '',
        adresse: '',
        date_naissance: '',
        groupe_sanguin: '',

        // Tuteur link (if dependant)
        tuteur_tel_recherche: '',
        tuteur_id: null,
        tuteur_nom_complet: ''
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const nextStep = () => setStep(s => Math.min(4, s + 1));
    const prevStep = () => setStep(s => Math.max(1, s - 1));

    return (
        <ReceptionLayout>
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full flex flex-col gap-6 md:gap-10 transition-all duration-[800ms]">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl md:text-3xl font-black text-titles dark:text-white tracking-tight leading-none uppercase italic">
                        Enregistrement Patient
                    </h1>
                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium italic">
                        Configuration du compte et du dossier médical informatisé.
                    </p>
                </div>

                {/* Stepper Premium */}
                <div className="flex items-center gap-4 bg-white dark:bg-[#1c2229] p-4 rounded-3xl border border-slate-200 dark:border-[#2d363f] shadow-sm overflow-x-auto no-scrollbar scroll-smooth">
                    {[
                        { num: 1, label: 'Type', icon: 'settings_accessibility' },
                        { num: 2, label: patientType === 'autonome' ? 'Compte' : 'Tuteur', icon: 'person' },
                        { num: 3, label: 'Identité', icon: 'badge' },
                        { num: 4, label: 'Médical', icon: 'medical_information' }
                    ].map((s) => (
                        <div key={s.num} className="flex items-center gap-3 shrink-0">
                            <div className={`size-10 rounded-xl flex items-center justify-center transition-all duration-500 ${step === s.num ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-110' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                            </div>
                            <div className="flex flex-col leading-none pr-4">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${step === s.num ? 'text-primary' : 'text-slate-400'}`}>Étape 0{s.num}</span>
                                <span className={`text-[11px] font-bold ${step === s.num ? 'text-titles dark:text-white' : 'text-slate-400'}`}>{s.label}</span>
                            </div>
                            {s.num < 4 && <div className="w-8 h-px bg-slate-200 dark:bg-slate-700/50 mr-2"></div>}
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm relative overflow-hidden">

                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <span className="material-symbols-outlined text-[120px] text-primary">analytics</span>
                    </div>

                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                            <div className="text-center max-w-md mx-auto space-y-2">
                                <h3 className="text-xl font-bold text-titles dark:text-white">Quel type de patient enregistrez-vous ?</h3>
                                <p className="text-sm text-slate-500 font-medium">Cette distinction permet de structurer les accès au compte utilisateur.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div
                                    onClick={() => setPatientType('autonome')}
                                    className={`p-8 rounded-[2rem] border-2 cursor-pointer transition-all flex flex-col gap-5 ${patientType === 'autonome' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
                                >
                                    <div className={`size-14 rounded-[1.25rem] flex items-center justify-center ${patientType === 'autonome' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                        <span className="material-symbols-outlined text-[32px]">person_check</span>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className={`text-lg font-black tracking-tight ${patientType === 'autonome' ? 'text-primary' : 'text-titles dark:text-white'}`}>Patient Autonome</h4>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic">Le patient possède son propre compte (n° de téléphone) et gère ses données seul.</p>
                                    </div>
                                    {patientType === 'autonome' && <span className="material-symbols-outlined text-primary self-end">check_circle</span>}
                                </div>

                                <div
                                    onClick={() => setPatientType('dependant')}
                                    className={`p-8 rounded-[2rem] border-2 cursor-pointer transition-all flex flex-col gap-5 ${patientType === 'dependant' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
                                >
                                    <div className={`size-14 rounded-[1.25rem] flex items-center justify-center ${patientType === 'dependant' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                        <span className="material-symbols-outlined text-[32px]">family_restroom</span>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className={`text-lg font-black tracking-tight ${patientType === 'dependant' ? 'text-primary' : 'text-titles dark:text-white'}`}>Patient Dépendant</h4>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic">Enfant ou personne sous tutelle. Ses données sont rattachées au compte d'un tuteur.</p>
                                    </div>
                                    {patientType === 'dependant' && <span className="material-symbols-outlined text-primary self-end">check_circle</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            {patientType === 'autonome' ? (
                                <>
                                    <h3 className="text-xl font-bold text-titles dark:text-white flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary">account_circle</span>
                                        Création du compte utilisateur
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Numéro de téléphone (ID)</label>
                                            <input name="tel" value={formData.tel} onChange={handleInputChange} type="tel" placeholder="+229 00 00 00 00" className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">WhatsApp (Optionnel)</label>
                                            <input name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} type="tel" placeholder="+229 00 00 00 00" className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Mot de passe provisoire</label>
                                            <input name="mot_de_passe" value={formData.mot_de_passe} onChange={handleInputChange} type="password" placeholder="••••••••" className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none" />
                                        </div>
                                        <div className="flex items-center gap-3 pt-6">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input name="est_tuteur" checked={formData.est_tuteur} onChange={handleInputChange} type="checkbox" className="sr-only peer" />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Ce patient est aussi un Tuteur</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-xl font-bold text-titles dark:text-white flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary">search</span>
                                        Recherche du Tuteur
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-1 space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Téléphone du tuteur</label>
                                                <div className="relative">
                                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">call</span>
                                                    <input name="tuteur_tel_recherche" value={formData.tuteur_tel_recherche} onChange={handleInputChange} type="tel" placeholder="Rechercher..." className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl pl-12 pr-5 text-sm font-bold text-titles dark:text-white transition-all outline-none" />
                                                </div>
                                            </div>
                                            <button className="h-14 px-8 bg-primary/10 text-primary rounded-2xl font-black text-xs uppercase tracking-widest sm:mt-6 hover:bg-primary hover:text-white transition-all">Vérifier</button>
                                        </div>

                                        {/* Mock result */}
                                        <div className="p-6 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 italic font-black">?</div>
                                                <p className="text-sm font-bold text-slate-400 italic uppercase">Aucun tuteur sélectionné pour le moment</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            <h3 className="text-xl font-bold text-titles dark:text-white flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">badge</span>
                                État-Civil du Patient
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Nom</label>
                                    <input name="nom" value={formData.nom} onChange={handleInputChange} type="text" placeholder="Ex: KONE" className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none uppercase" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Prénoms</label>
                                    <input name="prenom" value={formData.prenom} onChange={handleInputChange} type="text" placeholder="Ex: Sarah" className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Sexe</label>
                                    <div className="flex gap-4">
                                        {['Homme', 'Femme'].map(s => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, sexe: s }))}
                                                className={`flex-1 h-14 rounded-2xl font-bold text-sm transition-all border-2 ${formData.sexe === s ? 'border-primary bg-primary/5 text-primary' : 'border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400'}`}
                                            >
                                                {s === 'Homme' ? 'Masculin' : 'Féminin'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Date de naissance</label>
                                    <input name="date_naissance" value={formData.date_naissance} onChange={handleInputChange} type="date" className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none" />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            <h3 className="text-xl font-bold text-titles dark:text-white flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">medical_information</span>
                                Données Médicales & Adresse
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <div className="space-y-2 font-bold italic">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Taille (cm)</label>
                                    <input name="taille" value={formData.taille} onChange={handleInputChange} type="number" placeholder="175" className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white outline-none" />
                                </div>
                                <div className="space-y-2 font-bold italic">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Poids (kg)</label>
                                    <input name="poids" value={formData.poids} onChange={handleInputChange} type="number" placeholder="70" className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Groupe Sanguin</label>
                                    <select name="groupe_sanguin" value={formData.groupe_sanguin} onChange={handleInputChange} className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white outline-none cursor-pointer">
                                        <option value="">Sélectionner</option>
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Adresse complète</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-5 material-symbols-outlined text-slate-400">location_on</span>
                                        <textarea name="adresse" value={formData.adresse} onChange={handleInputChange} rows="3" placeholder="Lot, Quartier, Ville..." className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/20 rounded-2xl pl-12 pr-5 py-5 text-sm font-bold text-titles dark:text-white transition-all outline-none resize-none"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 md:mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                        <button
                            onClick={prevStep}
                            className={`h-14 px-10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all sm:w-48 ${step === 1 ? 'hidden' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            Précédent
                        </button>

                        {step === 4 ? (
                            <button className="h-14 px-12 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 w-full sm:w-auto">
                                <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                                Finaliser l'inscription
                            </button>
                        ) : (
                            <button
                                onClick={nextStep}
                                className="h-14 px-12 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 w-full sm:ml-auto sm:w-auto"
                            >
                                Suivant
                                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="p-6 rounded-[2rem] bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 flex gap-5 items-center animate-pulse">
                    <div className="size-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">info</span>
                    </div>
                    <p className="text-[10px] text-indigo-700/80 dark:text-indigo-400/80 font-black uppercase tracking-widest leading-relaxed">
                        Le système génère automatiquement un dossier médical informatisé et envoie un SMS de bienvenue avec les identifiants au {formData.tel || 'numéro indiqué'}.
                    </p>
                </div>
            </div>
        </ReceptionLayout>
    );
};

export default EnregistrementPatient;
