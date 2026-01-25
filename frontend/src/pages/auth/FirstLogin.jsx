import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import authService from '../../services/auth/authService';

const FirstLogin = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [verifying, setVerifying] = useState(true);

    // Auth & Validity Check
    useEffect(() => {
        const verify = async () => {
            // 1. Check if user is already logged in
            const token = localStorage.getItem('token');
            if (token) {
                // Try to redirect based on role or just generic fallback
                try {
                    const user = JSON.parse(localStorage.getItem('user'));
                    if (user && user.role) {
                        if (user.role === 'admin') navigate('/admin');
                        else if (user.role === 'accueil') navigate('/accueil');
                        else if (user.role === 'medecin') navigate('/medecin');
                        else if (user.role === 'patient') navigate('/patient');
                        return;
                    }
                } catch (e) { }
                navigate('/login'); // Fallback
                return;
            }

            // 2. Strictly require 'connexion' parameter
            const loginParam = searchParams.get('connexion');
            if (!loginParam) {
                // Invalid link (e.g. ?tel=... or empty)
                navigate('/login');
                return;
            }

            // 3. Verify validity of the identifier
            try {
                const status = await authService.checkActivation(loginParam);

                if (status.status === 'not_found' || status.status === 'activated') {
                    // Invalid user or already active
                    navigate('/login');
                    return;
                }

                // Valid pending account -> Enable form
                setFormData(prev => ({ ...prev, login: loginParam }));
                setVerifying(false);

            } catch (e) {
                console.error("Check activation error", e);
                navigate('/login');
            }
        };
        verify();
    }, [navigate, searchParams]);

    const [formData, setFormData] = useState({
        login: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    if (verifying) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-slate-500 font-medium italic">Vérification du lien...</p>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation
        if (formData.newPassword.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            setLoading(false);
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        try {
            await authService.updatePassword({
                login: formData.login,
                nouveau_mot_de_passe: formData.newPassword,
                nouveau_mot_de_passe_confirmation: formData.confirmPassword
            });

            // Auto-login after password update
            const loginResponse = await authService.loginByPhone(formData.login, formData.newPassword);

            // Store user info (already handled by service, but good to be explicit about flow)
            if (loginResponse.user) {
                const role = loginResponse.user.role;
                setSuccess(true);

                setTimeout(() => {
                    if (role === 'admin') navigate('/admin');
                    else if (role === 'accueil') navigate('/accueil');
                    else if (role === 'medecin') navigate('/medecin');
                    else if (role === 'patient') navigate('/patient');
                    else navigate('/login');
                }, 2000);
            } else {
                navigate('/login');
            }

        } catch (err) {
            console.error("FULL ERROR DETAILS:", err);
            console.error("RESPONSE DATA:", err.response?.data);
            console.error("RESPONSE STATUS:", err.response?.status);
            setError(err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour.');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-12 max-w-md w-full text-center space-y-6">
                    <div className="size-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                        <span className="material-symbols-outlined text-4xl">check_circle</span>
                    </div>
                    <h1 className="text-2xl font-black text-titles dark:text-white uppercase italic">Compte activé !</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">
                        Redirection vers votre espace en cours...
                    </p>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row shadow-inner overflow-hidden">
            {/* Design Side */}
            <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden items-center justify-center p-20">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-[-10%] left-[-10%] size-96 bg-white rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] size-[500px] bg-slate-900 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10 flex flex-col gap-8 text-white">
                    <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[3rem] border border-white/20">
                        <Logo size="lg" light />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
                            Activez votre <br /> <span className="text-white/50">Espace Santé</span>
                        </h2>
                        <p className="text-xl text-white/70 font-medium italic max-w-md">
                            C'est votre première connexion ? Définissez un mot de passe sécurisé pour accéder à vos documents médicaux.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative">
                <div className="lg:hidden mb-12">
                    <Logo size="md" />
                </div>

                <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-black text-titles dark:text-white uppercase italic tracking-tighter">Première Connexion</h1>
                        <p className="text-slate-400 font-bold italic uppercase tracking-widest text-[10px]">Identifiez-vous et créez votre mot de passe</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Identify by phone */}
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1 group-focus-within:text-primary transition-colors">Numéro de téléphone ou WhatsApp</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">call</span>
                                <input
                                    type="text"
                                    value={formData.login}
                                    readOnly
                                    className="w-full h-16 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] pl-14 pr-6 text-sm font-bold text-slate-500 dark:text-slate-400 outline-none cursor-not-allowed shadow-none"
                                />
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1 group-focus-within:text-primary transition-colors">Nouveau mot de passe</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">key</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    placeholder="Minimum 8 caractères"
                                    autoComplete="new-password"
                                    className="w-full h-16 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] pl-14 pr-14 text-sm font-bold text-titles dark:text-white outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1 group-focus-within:text-primary transition-colors">Confirmez le mot de passe</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">check_circle</span>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="Confirmez votre mot de passe"
                                    autoComplete="new-password"
                                    className="w-full h-16 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] pl-14 pr-14 text-sm font-bold text-titles dark:text-white outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <span className="material-symbols-outlined text-rose-500 font-bold">warning</span>
                                <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase italic tracking-tight">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 bg-primary text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    Activer mon compte
                                    <span className="material-symbols-outlined text-[20px]">bolt</span>
                                </>
                            )}
                        </button>
                    </form>

                    <button
                        onClick={() => navigate('/login')}
                        className="w-full text-center text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-[0.2em] transition-colors"
                    >
                        Retour à la connexion
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FirstLogin;
