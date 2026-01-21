import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';
import Logo from '../../components/common/Logo';

const AideConnexion = () => {
    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col transition-colors duration-300">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-4">
                        <Link
                            to="/login"
                            className="size-9 md:size-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-all flex items-center justify-center shrink-0"
                            title="Retour"
                        >
                            <span className="material-symbols-outlined text-[18px] md:text-[22px]">arrow_back</span>
                        </Link>
                        <Link to="/login" className="flex items-center gap-2 md:gap-4 hover:opacity-80 transition-opacity">
                            <Logo size="sm md:md" showText={true} />
                        </Link>
                    </div>

                    <ThemeToggle />
                </div>
            </header>

            <main className="flex-1 py-8 md:py-12">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                    {/* Page Title */}
                    <div className="mb-8 md:mb-12">
                        <h1 className="text-2xl md:text-4xl font-black text-titles dark:text-white tracking-tight mb-2 md:mb-3 uppercase italic leading-tight">
                            Centre d'Aide & Support
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-lg font-medium">
                            Tout ce que vous devez savoir pour accéder à votre compte DME
                        </p>
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <Link to="/login" className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-primary transition-all group">
                            <div className="flex items-start gap-4">
                                <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-[24px]">login</span>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-titles dark:text-white mb-1">Page de Connexion</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Accéder à votre espace personnel</p>
                                </div>
                            </div>
                        </Link>

                        <Link to="/forgot-password" className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-all group">
                            <div className="flex items-start gap-4">
                                <div className="size-12 rounded-xl bg-amber-100 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-[24px]">lock_reset</span>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-titles dark:text-white mb-1">Mot de passe oublié</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Réinitialiser vos identifiants</p>
                                </div>
                            </div>
                        </Link>

                        <div className="bg-gradient-to-br from-primary to-[#35577D] rounded-2xl p-6 text-white">
                            <div className="flex items-start gap-4">
                                <div className="size-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[24px]">support_agent</span>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold mb-1">Support Technique</h3>
                                    <p className="text-sm text-white/80">Service IT - Poste 405</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* FAQ Section - Takes 2 columns */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                                <h2 className="text-2xl font-black text-titles dark:text-white mb-6 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-[28px]">help</span>
                                    Questions Fréquentes
                                </h2>

                                <div className="space-y-4">
                                    {[
                                        {
                                            q: "Comment me connecter pour la première fois ?",
                                            a: "Utilisez le numéro de téléphone que vous avez fourni lors de votre inscription (avec l'indicatif +229). Le mot de passe provisoire vous a été envoyé par SMS."
                                        },
                                        {
                                            q: "Quel identifiant dois-je utiliser ?",
                                            a: "Votre identifiant est votre numéro de téléphone principal. Si vous avez renseigné un numéro WhatsApp différent, vous pouvez également l'utiliser."
                                        },
                                        {
                                            q: "La connexion avec mon WhatsApp ne fonctionne pas",
                                            a: "Si votre numéro WhatsApp est différent de votre numéro de téléphone principal, essayez de vous connecter avec votre numéro de téléphone. Vous pouvez ensuite mettre à jour votre numéro WhatsApp dans votre profil."
                                        },
                                        {
                                            q: "J'ai oublié mon mot de passe, que faire ?",
                                            a: "Cliquez sur 'Mot de passe oublié ?' sur la page de connexion. Entrez votre numéro de téléphone, et un code de réinitialisation vous sera envoyé par SMS."
                                        },
                                        {
                                            q: "Mon compte est bloqué après plusieurs tentatives",
                                            a: "Pour des raisons de sécurité, votre compte est temporairement verrouillé après 5 tentatives échouées. Attendez 15 minutes ou contactez le service informatique (poste 405)."
                                        },
                                        {
                                            q: "Je ne reçois pas le SMS de réinitialisation",
                                            a: "Vérifiez que le numéro est correct et que votre téléphone a du réseau. Si le problème persiste, contactez l'accueil pour vérifier votre numéro dans le système."
                                        },
                                        {
                                            q: "Puis-je changer mon numéro de téléphone ?",
                                            a: "Oui, vous pouvez modifier votre numéro de téléphone et WhatsApp directement depuis votre profil après connexion."
                                        },
                                        {
                                            q: "Je n'ai pas de compte, comment en créer un ?",
                                            a: "Tous les comptes sont créés sur place à l'hôpital par le personnel de l'accueil. Présentez-vous au bureau d'accueil avec une pièce d'identité valide pour créer votre compte."
                                        }
                                    ].map((faq, i) => (
                                        <details key={i} className="group border-b border-slate-100 dark:border-slate-800 pb-4 last:border-none">
                                            <summary className="flex justify-between items-start cursor-pointer list-none py-3 hover:text-primary transition-colors">
                                                <span className="text-sm font-bold text-titles dark:text-white pr-4">{faq.q}</span>
                                                <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform shrink-0">
                                                    expand_more
                                                </span>
                                            </summary>
                                            <p className="pt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                {faq.a}
                                            </p>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Security Tips - Takes 1 column */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                                <h3 className="text-lg font-black text-titles dark:text-white mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-rose-500">shield</span>
                                    Conseils de Sécurité
                                </h3>

                                <div className="space-y-4">
                                    {[
                                        {
                                            icon: 'password',
                                            title: 'Mot de passe fort',
                                            desc: 'Minimum 8 caractères avec chiffres et lettres'
                                        },
                                        {
                                            icon: 'no_accounts',
                                            title: 'Ne partagez jamais',
                                            desc: 'Vos identifiants sont strictement personnels'
                                        },
                                        {
                                            icon: 'logout',
                                            title: 'Déconnexion',
                                            desc: 'Toujours se déconnecter après utilisation'
                                        },
                                        {
                                            icon: 'verified_user',
                                            title: 'Vérifiez l\'URL',
                                            desc: 'Assurez-vous d\'être sur le bon site'
                                        }
                                    ].map((tip, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                            <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">{tip.icon}</span>
                                            <div>
                                                <h4 className="text-sm font-bold text-titles dark:text-white mb-0.5">{tip.title}</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{tip.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                                <h3 className="text-lg font-black text-titles dark:text-white mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-500">contact_support</span>
                                    Besoin d'aide ?
                                </h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <span className="material-symbols-outlined text-[18px]">call</span>
                                        <span>Service IT : Poste 405</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <span className="material-symbols-outlined text-[18px]">schedule</span>
                                        <span>Lun-Ven : 8h00 - 17h00</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                                        <span>Bureau Informatique - Étage 2</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8 text-center">
                    <p className="text-slate-400 dark:text-slate-600 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                        © {new Date().getFullYear()} DME • Plateforme de Gestion Médicale • Propulsé par MDN
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AideConnexion;
