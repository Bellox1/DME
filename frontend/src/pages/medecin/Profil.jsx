import React, { useState, useEffect, useRef } from 'react';
import DoctorLayout from '../../components/layouts/DoctorLayout';
import medecinService from '../../services/medecin/medecinService';

const DoctorProfil = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const fileInputRef = useRef(null);

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : { nom: '', prenom: '', role: 'medecin', tel: '', whatsapp: '', sexe: 'F', ville: '', photo: null };
    });

    const [profileData, setProfileData] = useState({
        nom: user.nom || '',
        prenom: user.prenom || '',
        sexe: user.sexe === 'Homme' ? 'M' : 'F',
        tel: user.tel || '',
        whatsapp: user.whatsapp || '',
        ville: user.ville || ''
    });

    const [securityData, setSecurityData] = useState({
        mot_de_passe_actuel: '',
        nouveau_mot_de_passe: '',
        nouveau_mot_de_passe_confirmation: ''
    });

    // Reset message after 5s
    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleSecurityChange = (e) => {
        setSecurityData({ ...securityData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await medecinService.updateProfile(profileData);
            if (res.success) {
                // Update local user and storage
                const updatedUser = { ...user, ...res.user };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la mise à jour.' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSecurity = async (e) => {
        e.preventDefault();
        if (securityData.nouveau_mot_de_passe !== securityData.nouveau_mot_de_passe_confirmation) {
            setMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await medecinService.updatePassword({
                mot_de_passe_actuel: securityData.mot_de_passe_actuel,
                nouveau_mot_de_passe: securityData.nouveau_mot_de_passe,
                nouveau_mot_de_passe_confirmation: securityData.nouveau_mot_de_passe_confirmation
            });
            setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès !' });
            setSecurityData({
                mot_de_passe_actuel: '',
                nouveau_mot_de_passe: '',
                nouveau_mot_de_passe_confirmation: ''
            });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la mise à jour de la sécurité.' });
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('photo', file);

        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await medecinService.updatePhoto(formData);
            if (res.success) {
                const updatedUser = { ...user, photo: res.user.photo };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setMessage({ type: 'success', text: 'Photo de profil mise à jour !' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de l\'upload de la photo.' });
        } finally {
            setUploading(false);
        }
    };

    const getPhotoUrl = () => {
        if (user.photo) {
            // Adjust based on your storage symlink or use a full URL if provided by backend
            return `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/storage/${user.photo}`;
        }
        return null;
    };

    return (
        <DoctorLayout>
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 md:gap-12 transition-all duration-[800ms]">
                {/* Notification Toast */}
                {message.text && (
                    <div className={`fixed top-24 right-8 z-[100] animate-in slide-in-from-right-full duration-500`}>
                        <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${message.type === 'success'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-rose-50 border-rose-200 text-rose-800'
                            }`}>
                            <span className="material-symbols-outlined">
                                {message.type === 'success' ? 'check_circle' : 'error'}
                            </span>
                            <span className="text-sm font-bold">{message.text}</span>
                        </div>
                    </div>
                )}

                {/* Header avec Bannière Premium */}
                <div className="relative">
                    {/* Bannière */}
                    <div className="h-48 md:h-56 rounded-[2rem] bg-gradient-to-r from-primary to-[#35577D] overflow-hidden shadow-xl relative">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:20px_20px]"></div>

                        {/* Nom et Rôle SUR l'arrière-plan */}
                        <div className="absolute bottom-6 md:bottom-10 left-36 md:left-48 right-6 flex flex-col gap-1 md:ml-4 animate-in fade-in slide-in-from-left-4 duration-700">
                            <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-white drop-shadow-lg tracking-tight uppercase italic transition-all leading-tight">Dr. {user.prenom} {user.nom}</h1>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-md text-[9px] md:text-[10px] font-bold text-white uppercase tracking-widest border border-white/30">MÉDECIN</span>
                                <span className="size-1.5 rounded-full bg-green-400 shadow-sm animate-pulse"></span>
                                <span className="text-[10px] md:text-xs text-white/90 font-bold uppercase tracking-wide italic">Session Professionnelle</span>
                            </div>
                        </div>
                    </div>
                    {/* Photo de Profil */}
                    <div className="absolute -bottom-8 left-6 md:left-12 z-20">
                        <div className="relative group">
                            <div className="size-28 md:size-36 rounded-3xl bg-white dark:bg-slate-900 p-1 md:p-1.5 shadow-2xl transition-transform hover:scale-105 duration-300">
                                <div className="size-full rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-slate-50 dark:border-slate-800 relative">
                                    {getPhotoUrl() ? (
                                        <img src={getPhotoUrl()} alt="Profile" className="size-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined text-primary text-5xl md:text-7xl">local_hospital</span>
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <div className="size-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <button
                                onClick={handlePhotoClick}
                                disabled={uploading}
                                className="absolute bottom-1 right-1 size-8 md:size-9 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center border-2 md:border-4 border-white dark:border-slate-900 hover:scale-110 transition-transform active:scale-95 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[16px] md:text-[20px]">photo_camera</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-4">
                    {/* Colonne Gauche: Navigation */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-3xl p-2.5 shadow-sm sticky top-24">
                            {[
                                { id: 'general', label: 'Informations', icon: 'person' },
                                { id: 'security', label: 'Sécurité', icon: 'security' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl transition-all duration-300 mb-1 last:mb-0 ${activeTab === tab.id
                                        ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20 scale-[1.02]'
                                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:translate-x-1'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[22px]">{tab.icon}</span>
                                    <span className="text-[13px] tracking-wide">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Colonne Droite: Formulaires */}
                    <div className="lg:col-span-9">
                        {activeTab === 'general' && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] p-10 shadow-sm relative overflow-hidden">
                                <h3 className="text-xl font-bold text-titles dark:text-white mb-10 flex items-center gap-3">
                                    <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined">badge</span>
                                    </div>
                                    Informations Personnelles
                                </h3>

                                <form className="space-y-8" onSubmit={handleUpdateProfile}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em] pl-1">Nom</label>
                                            <input
                                                type="text"
                                                name="nom"
                                                value={profileData.nom}
                                                onChange={handleProfileChange}
                                                className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em] pl-1">Prénom</label>
                                            <input
                                                type="text"
                                                name="prenom"
                                                value={profileData.prenom}
                                                onChange={handleProfileChange}
                                                className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em] pl-1">Sexe</label>
                                            <select
                                                name="sexe"
                                                value={profileData.sexe}
                                                onChange={handleProfileChange}
                                                className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="F">Féminin</option>
                                                <option value="M">Masculin</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em] pl-1">Numéro de Téléphone</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">call</span>
                                                <input
                                                    type="tel"
                                                    name="tel"
                                                    value={profileData.tel}
                                                    onChange={handleProfileChange}
                                                    className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl pl-12 pr-5 text-sm font-bold text-titles dark:text-white transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em] pl-1">WhatsApp</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-green-500 text-[20px]">chat</span>
                                                <input
                                                    type="tel"
                                                    name="whatsapp"
                                                    value={profileData.whatsapp}
                                                    onChange={handleProfileChange}
                                                    className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl pl-12 pr-5 text-sm font-bold text-titles dark:text-white transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em] pl-1">Ville</label>
                                            <input
                                                type="text"
                                                name="ville"
                                                value={profileData.ville}
                                                onChange={handleProfileChange}
                                                className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 text-sm font-bold text-titles dark:text-white transition-all outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full md:w-auto px-12 h-14 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <span>{loading ? 'Traitement...' : 'Mettre à jour le profil'}</span>
                                            {!loading && <span className="material-symbols-outlined text-[20px]">check_circle</span>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2rem] p-10 shadow-sm overflow-hidden">
                                <h3 className="text-xl font-bold text-titles dark:text-white mb-10 flex items-center gap-3">
                                    <div className="size-11 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined">lock_reset</span>
                                    </div>
                                    Sécurité du compte
                                </h3>

                                <form className="space-y-8" onSubmit={handleUpdateSecurity}>
                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider pl-1">Mot de passe actuel</label>
                                        <input
                                            type="password"
                                            name="mot_de_passe_actuel"
                                            value={securityData.mot_de_passe_actuel}
                                            onChange={handleSecurityChange}
                                            placeholder="Saisir votre mot de passe actuel"
                                            autoComplete="current-password"
                                            className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 text-sm font-bold text-titles dark:text-white focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider pl-1">Nouveau mot de passe</label>
                                            <input
                                                type="password"
                                                name="nouveau_mot_de_passe"
                                                value={securityData.nouveau_mot_de_passe}
                                                onChange={handleSecurityChange}
                                                placeholder="Nouveau mot de passe"
                                                autoComplete="new-password"
                                                className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 text-sm font-bold text-titles dark:text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider pl-1">Confirmer le nouveau</label>
                                            <input
                                                type="password"
                                                name="nouveau_mot_de_passe_confirmation"
                                                value={securityData.nouveau_mot_de_passe_confirmation}
                                                onChange={handleSecurityChange}
                                                placeholder="Confirmer le nouveau mot de passe"
                                                autoComplete="new-password"
                                                className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 text-sm font-bold text-titles dark:text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full md:w-auto px-12 h-14 bg-orange-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {loading ? 'Mise à jour...' : 'Mettre à jour la sécurité'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default DoctorProfil;
