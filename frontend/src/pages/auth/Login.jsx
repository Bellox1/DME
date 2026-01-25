import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';
import Logo from '../../components/common/Logo';
import authService from '../../services/auth/authService';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Check if already logged in and redirect to appropriate dashboard
    React.useEffect(() => {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        const isFirstLogin = localStorage.getItem('user-first-login');

        // If logged in BUT it's a first login pending, force logout to show login screen
        if (isFirstLogin && isFirstLogin !== 'false') {
            localStorage.clear();
            return;
        }

        if (token && userString) {
            try {
                const user = JSON.parse(userString);
                if (user.role === 'admin') navigate('/admin');
                else if (user.role === 'accueil') navigate('/accueil');
                else if (user.role === 'medecin') navigate('/medecin');
                else if (user.role === 'patient') navigate('/patient');
            } catch (e) {
                localStorage.clear();
            }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Clean phone number (remove +229 if present or spaces)
            const cleanPhone = phone.replace(/\s/g, '');

            // In a real app, we'd send the full international format or whatever the backend expects
            // Here we send what's in the input after +229
            const response = await authService.loginByPhone(cleanPhone, password);

            // Store user info
            localStorage.setItem('user', JSON.stringify(response.user));
            if (response.token) {
                localStorage.setItem('token', response.token);
            }

            // Check for First Login status (handle boolean, integer 1, or string "1")
            const isFirstLogin = response.premiere_connexion;
            if (isFirstLogin === true || isFirstLogin === 1 || isFirstLogin === '1') {
                // Logout immediately (client-side)
                authService.logout();
                setError("Ce compte n'est pas encore activé. Veuillez utiliser le lien reçu par SMS/WhatsApp.");
                return;
            }

            // Role-based redirection
            const role = response.user.role;
            if (role === 'admin') navigate('/admin');
            else if (role === 'accueil') navigate('/accueil');
            else if (role === 'medecin') navigate('/medecin');
            else if (role === 'patient') navigate('/patient');
            else navigate('/login');

        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Identifiants ou mot de passe invalides.');
        } finally {
            setLoading(false);
        }
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

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold uppercase italic">
                                {error}
                            </div>
                        )}

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
                                        placeholder="01 02 03 04 05"
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        disabled={loading}
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
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
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
                            <button
                                className={`w-full py-4 px-6 rounded-xl font-bold text-base shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${loading ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 text-white shadow-primary/30'}`}
                                type="submit"
                                disabled={loading}
                            >
                                {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                {loading ? 'Connexion en cours...' : 'Se connecter'}
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
