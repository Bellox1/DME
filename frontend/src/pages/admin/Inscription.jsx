import React, { useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import api from '../../services/api';

const AdminInscription = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        sexe: 'Homme',
        ville: '',
        role: '',
        tel: '',
        whatsapp: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            await api.post('/admin/users', formData);
            setMessage({ type: 'success', text: 'Utilisateur créé avec succès. Le lien d\'activation a été envoyé.' });
            // Reset form
            setFormData({
                nom: '',
                prenom: '',
                sexe: 'Homme',
                ville: '',
                role: '',
                tel: '',
                whatsapp: ''
            });
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Erreur lors de la création de l\'utilisateur.'
            });
        } finally {
            setLoading(false);
        }
    };

    const recentRegistrations = [
        { name: 'Dr. Sophie Laurent', role: 'Médecin', contact: 'Tél: +229 90 00 00 01 • WhatsApp: +229 90 00 00 01', status: 'Actif', color: 'green' },
        { name: 'Julien Bernard', role: 'Patient', contact: 'WhatsApp: +229 97 00 00 02 • Créé il y a 5 heures', status: 'En attente', color: 'primary' },
    ];

    return (
        <AdminLayout>
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
                <div className="mb-6 md:mb-8 text-titles dark:text-white">
                    <h1 className="text-2xl md:text-4xl font-black leading-tight tracking-tight uppercase italic transition-all">Enregistrer un utilisateur (Staff)</h1>
                    <p className="text-[#6c757f] text-sm md:text-base font-normal mt-2 italic">Créez un compte pour un membre du personnel (Médecin, Accueil, Admin).</p>
                </div>

                <div className="bg-white dark:bg-[#1c2229] rounded-[2rem] border border-[#dee0e3] dark:border-[#2d363f] shadow-sm overflow-hidden text-titles dark:text-white">
                    <form className="p-6 md:p-10 space-y-6" onSubmit={handleSubmit}>

                        {message && (
                            <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                <span className="material-symbols-outlined">
                                    {message.type === 'success' ? 'check_circle' : 'error'}
                                </span>
                                <p className="text-sm font-bold">{message.text}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold uppercase tracking-wider">Nom</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6c757f] text-xl group-focus-within:text-primary transition-colors">person</span>
                                    <input
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        className="w-full rounded-lg text-titles dark:text-white border border-[#dee0e3] dark:border-[#2d363f] bg-white dark:bg-[#1c2229] h-12 pl-12 pr-4 placeholder:text-[#6c757f] text-sm font-normal focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                        placeholder="Ex: Durand"
                                        type="text"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold uppercase tracking-wider">Prénom</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6c757f] text-xl group-focus-within:text-primary transition-colors">badge</span>
                                    <input
                                        name="prenom"
                                        value={formData.prenom}
                                        onChange={handleChange}
                                        className="w-full rounded-lg text-titles dark:text-white border border-[#dee0e3] dark:border-[#2d363f] bg-white dark:bg-[#1c2229] h-12 pl-12 pr-4 placeholder:text-[#6c757f] text-sm font-normal focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                        placeholder="Ex: Martin"
                                        type="text"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold uppercase tracking-wider">Sexe</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6c757f] text-xl group-focus-within:text-primary transition-colors">wc</span>
                                    <select
                                        name="sexe"
                                        value={formData.sexe}
                                        onChange={handleChange}
                                        className="form-select w-full rounded-lg text-titles dark:text-white border border-[#dee0e3] dark:border-[#2d363f] bg-white dark:bg-[#1c2229] h-12 pl-12 pr-10 text-sm font-normal focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none accent-primary"
                                    >
                                        <option value="Homme">Homme</option>
                                        <option value="Femme">Femme</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold uppercase tracking-wider">Ville</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6c757f] text-xl group-focus-within:text-primary transition-colors">location_city</span>
                                    <input
                                        name="ville"
                                        value={formData.ville}
                                        onChange={handleChange}
                                        className="w-full rounded-lg text-titles dark:text-white border border-[#dee0e3] dark:border-[#2d363f] bg-white dark:bg-[#1c2229] h-12 pl-12 pr-4 placeholder:text-[#6c757f] text-sm font-normal focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                        placeholder="Ex: Cotonou"
                                        type="text"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold uppercase tracking-wider">Rôle de l'utilisateur</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6c757f] text-xl group-focus-within:text-primary transition-colors">shield_person</span>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required
                                        className="form-select w-full rounded-lg text-titles dark:text-white border border-[#dee0e3] dark:border-[#2d363f] bg-white dark:bg-[#1c2229] h-12 pl-12 pr-10 text-sm font-normal focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none accent-primary"
                                    >
                                        <option value="">Sélectionner un rôle</option>
                                        <option value="accueil">Accueil (Réception)</option>
                                        <option value="medecin">Médecin</option>
                                        <option value="admin">Administrateur</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold uppercase tracking-wider">
                                    Numéro de Téléphone <span className="text-[#6c757f] font-normal tracking-tight text-xs lowercase">(Optionnel)</span>
                                </label>
                                <div className="relative flex items-center group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6c757f] text-xl group-focus-within:text-primary transition-colors">call</span>
                                    <div className="absolute left-11 top-1/2 -translate-y-1/2 flex items-center gap-1 border-r border-[#dee0e3] dark:border-[#2d363f] pr-2 h-6 pointer-events-none group-focus-within:border-primary transition-colors">
                                        <span className="text-sm font-bold text-titles dark:text-white">+229</span>
                                    </div>
                                    <input
                                        name="tel"
                                        value={formData.tel}
                                        onChange={handleChange}
                                        className="w-full rounded-lg text-titles dark:text-white border border-[#dee0e3] dark:border-[#2d363f] bg-white dark:bg-[#1c2229] h-12 pl-24 pr-4 placeholder:text-[#6c757f] text-sm font-normal focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                        placeholder="01 23 45 67"
                                        type="tel"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold uppercase tracking-wider">
                                    Numéro WhatsApp <span className="text-[#6c757f] font-normal tracking-tight text-xs lowercase">(Optionnel)</span>
                                </label>
                                <div className="relative flex items-center group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6c757f] text-xl group-focus-within:text-primary transition-colors">chat</span>
                                    <div className="absolute left-11 top-1/2 -translate-y-1/2 flex items-center gap-1 border-r border-[#dee0e3] dark:border-[#2d363f] pr-2 h-6 pointer-events-none group-focus-within:border-primary transition-colors">
                                        <span className="text-sm font-bold text-titles dark:text-white">+229</span>
                                    </div>
                                    <input
                                        name="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={handleChange}
                                        className="w-full rounded-lg text-titles dark:text-white border border-[#dee0e3] dark:border-[#2d363f] bg-white dark:bg-[#1c2229] h-12 pl-24 pr-4 placeholder:text-[#6c757f] text-sm font-normal focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                        placeholder="01 23 45 67"
                                        type="tel"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary/5 p-4 rounded-xl flex items-start gap-4 border border-primary/20">
                            <span className="material-symbols-outlined text-primary text-2xl">info</span>
                            <p className="text-sm text-primary leading-relaxed font-semibold">
                                Au moins un des deux numéros (Téléphone ou WhatsApp) doit être renseigné pour envoyer le lien d'activation.
                            </p>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                className="px-6 h-12 rounded-lg border border-[#dee0e3] dark:border-[#2d363f] text-titles dark:text-white text-sm font-bold hover:bg-background-light dark:hover:bg-[#2d363f] transition-colors"
                                type="button"
                                onClick={() => setFormData({ nom: '', prenom: '', sexe: 'Homme', ville: '', role: '', tel: '', whatsapp: '' })}
                            >
                                Réinitialiser
                            </button>
                            <button
                                className="px-8 h-12 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                type="submit"
                                disabled={loading}
                            >
                                {loading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                                {loading ? 'Création...' : 'Créer le compte'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-12">
                    <h3 className="text-titles dark:text-white text-xl font-bold mb-4 tracking-tight uppercase italic">Dernières inscriptions</h3>
                    <div className="space-y-3">
                        {recentRegistrations.map((reg, i) => (
                            <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-[#1c2229] border border-[#dee0e3] dark:border-[#2d363f] rounded-2xl transition-all hover:border-primary/20 gap-4">
                                <div className="flex items-start md:items-center gap-4">
                                    <div className={`size-10 rounded-xl shrink-0 ${reg.color === 'green'
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                                        : 'bg-primary/10 text-primary'
                                        } flex items-center justify-center`}>
                                        <span className="material-symbols-outlined text-xl">person_add</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-titles dark:text-white">{reg.name}</p>
                                        <p className="text-[11px] md:text-xs text-[#6c757f] leading-relaxed italic">{reg.role} • {reg.contact}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 shrink-0 ${reg.color === 'green'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-primary/10 text-primary'
                                    } text-[10px] uppercase font-black rounded-full`}>
                                    {reg.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminInscription;
