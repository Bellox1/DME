import React, { useState } from 'react';
import Logo from './common/Logo';

const FirstLoginModal = ({ userPhone, onComplete }) => {
    const [formData, setFormData] = useState({
        phone: userPhone || '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.newPassword.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        // TODO: Appel API pour mettre à jour le mot de passe
        // Pour l'instant, on simule le succès
        onComplete();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex justify-center mb-6">
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg">
                            <Logo size="md" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-titles dark:text-white text-center mb-2">
                        Première Connexion
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                        Définissez votre mot de passe personnel
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Phone Number (Read-only) */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">
                            Numéro de téléphone
                        </label>
                        <div className="h-14 bg-slate-50 dark:bg-slate-800/50 rounded-2xl px-5 flex items-center border-2 border-transparent">
                            <span className="material-symbols-outlined text-slate-400 mr-3">call</span>
                            <span className="text-sm font-bold text-titles dark:text-white">
                                {formData.phone}
                            </span>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">
                            Nouveau mot de passe
                        </label>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
                                key
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                placeholder="Minimum 8 caractères"
                                className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl pl-14 pr-14 text-sm font-bold text-titles dark:text-white transition-all outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">
                            Confirmer le mot de passe
                        </label>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
                                check_circle
                            </span>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="Retapez votre mot de passe"
                                className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl pl-14 pr-14 text-sm font-bold text-titles dark:text-white transition-all outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <span className="material-symbols-outlined text-red-600 text-[20px]">error</span>
                            <p className="text-sm font-bold text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full h-14 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <span>Définir mon mot de passe</span>
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                </form>

                {/* Footer Note */}
                <div className="px-8 pb-8 pt-0">
                    <p className="text-xs text-center text-slate-400 dark:text-slate-500 italic">
                        Cette étape est obligatoire pour accéder à votre espace
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FirstLoginModal;
