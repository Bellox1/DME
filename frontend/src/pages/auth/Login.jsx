import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';
import Logo from '../../components/common/Logo';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Authentification réelle avec l'API
        // Pour l'instant, redirection basique selon le rôle (à adapter)
        navigate('/admin');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display transition-colors duration-300">
            <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-2 md:gap-3">
                <Link
                    to="/aide-connexion"
                    className="size-10 md:size-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all group"
                    title="Centre d'aide"
                >
                    <span className="material-symbols-outlined text-[20px] md:text-[22px]">help</span>
                </Link>
                <div className="flex items-center scale-90 md:scale-100">
                    <ThemeToggle />
                </div>
            </div>

            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-[440px]">
                    <div className="flex flex-col items-center mb-10">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl shadow-primary/5 border border-slate-100 dark:border-slate-800 mb-6 transition-all duration-500">
                            <Logo size="lg" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium italic">Plateforme de Gestion Médicale</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-6 md:p-8">

                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Se connecter</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Veuillez entrer vos identifiants ci-dessous.</p>
                        </div>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Numéro de téléphone ou WhatsApp
                                </label>
                                <div className="relative flex items-center">
                                    <div className="absolute left-0 h-full flex items-center px-4 pointer-events-none border-r border-slate-200 dark:border-slate-700">
                                        <span className="text-slate-500 dark:text-slate-400 font-bold">+229</span>
                                    </div>
                                    <input
                                        className="block w-full pl-20 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                        placeholder="60 00 00 00"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Mot de passe
                                    </label>
                                    <Link className="text-xs font-bold text-primary hover:text-primary/80 transition-colors" to="/forgot-password">Oublié ?</Link>
                                </div>
                                <div className="relative">
                                    <input
                                        className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                            </div>
                            <button className="w-full py-4 px-6 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-base shadow-lg shadow-primary/30 transition-all active:scale-[0.98]" type="submit">
                                Se connecter
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <footer className="py-6 px-4">
                <div className="max-w-[440px] mx-auto text-center border-t border-slate-200 dark:border-slate-800 pt-6">
                    <p className="text-slate-400 dark:text-slate-600 text-[11px] leading-relaxed uppercase tracking-wider font-bold">
                        © {new Date().getFullYear()} DME • Plateforme de Gestion Médicale<br />
                        Propulsé par MDN
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Login;
