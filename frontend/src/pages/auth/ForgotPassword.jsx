import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';
import Logo from '../../components/common/Logo';

const ForgotPassword = () => {
    const [phone, setPhone] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic for sending reset code/link to phone/whatsapp
        setIsSubmitted(true);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display transition-colors duration-300">
            <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
                <Link
                    to="/aide-connexion"
                    className="size-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all group"
                    title="Centre d'aide"
                >
                    <span className="material-symbols-outlined text-[22px]">help</span>
                </Link>
                <ThemeToggle />
            </div>

            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-[440px]">
                    <div className="flex flex-col items-center mb-10">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl shadow-primary/5 border border-slate-100 dark:border-slate-800 mb-6 transition-all duration-500">
                            <Logo size="lg" />
                        </div>
                        <h1 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">Réinitialisation</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium italic">Plateforme de Gestion Médicale</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-primary/10 border border-slate-100 dark:border-slate-800 p-10">
                        {!isSubmitted ? (
                            <>
                                <div className="mb-10">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Mot de passe oublié ?</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                                        Entrez votre numéro pour recevoir un code de réinitialisation.
                                    </p>
                                </div>
                                <form className="space-y-8" onSubmit={handleSubmit}>
                                    <div className="space-y-3">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 pl-1">
                                            Numéro de téléphone / WhatsApp
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[22px]">phone_iphone</span>
                                            <input
                                                className="block w-full h-14 pl-14 pr-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl text-slate-900 dark:text-white font-bold transition-all outline-none"
                                                placeholder="90 00 00 00"
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black shadow-xl shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2" type="submit">
                                        <span>Réinitialiser</span>
                                        <span className="material-symbols-outlined text-[20px]">refresh</span>
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-500">
                                <div className="size-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                    <span className="material-symbols-outlined text-3xl font-bold">chat</span>
                                    <span className="absolute -top-1 -right-1 size-6 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center border-2 border-green-500">
                                        <span className="material-symbols-outlined text-green-500 text-xs font-black">check</span>
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Message envoyé !</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 px-4 leading-relaxed">
                                    Une notification de secours vient d'être envoyée au numéro <br />
                                    <b className="text-titles dark:text-white text-base">+229 {phone}</b>. <br />
                                    Vérifiez vos SMS ou WhatsApp.
                                </p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="px-6 py-2.5 rounded-xl border-2 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                >
                                    Renvoyer le code
                                </button>
                            </div>
                        )}

                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                            <Link to="/login" className="text-slate-500 dark:text-slate-400 text-sm font-bold flex items-center justify-center gap-2 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                Retour à la connexion
                            </Link>
                        </div>
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

export default ForgotPassword;
