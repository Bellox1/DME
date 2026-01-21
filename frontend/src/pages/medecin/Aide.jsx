import React from 'react';
import DoctorLayout from '../../components/layouts/DoctorLayout';

const AideMedecin = () => {
    return (
        <DoctorLayout>
            <div className="p-8 max-w-5xl mx-auto w-full flex flex-col gap-10 transition-all duration-[800ms]">
                <div className="flex flex-col gap-1 text-center">
                    <h1 className="text-3xl font-black text-titles dark:text-white tracking-tight leading-none italic uppercase">Espace Assistance Médicale</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Guide d'utilisation et support technique pour les praticiens.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: 'Tutoriels Vidéos', icon: 'play_circle', desc: 'Apprenez à utiliser les fonctions avancées en vidéo.' },
                        { title: 'Documentation', icon: 'menu_book', desc: 'Guide complet PDF sur la gestion des dossiers.' },
                        { title: 'Support En Direct', icon: 'support_agent', desc: 'Chattez avec un technicien du centre.' },
                    ].map((item, i) => (
                        <div key={i} className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all text-center group cursor-pointer">
                            <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[32px]">{item.icon}</span>
                            </div>
                            <h3 className="text-sm font-black text-titles dark:text-white uppercase mb-2 tracking-tight">{item.title}</h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium italic leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-12">
                        <div className="bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-[2.5rem] p-10 shadow-sm">
                            <h3 className="text-xl font-black text-titles dark:text-white mb-8 border-l-4 border-l-primary pl-6 uppercase italic">Questions Fréquentes (FAQ)</h3>

                            <div className="space-y-4">
                                {[
                                    {
                                        q: "Comment signer numériquement une ordonnance ?",
                                        a: "Une fois les médicaments saisis, cliquez sur le bouton 'Signer & Envoyer' en bas de page. Le document sera automatiquement envoyé sur le compte du patient et archivé pour le pharmacien."
                                    },
                                    {
                                        q: "Comment accéder à l'historique complet d'un nouveau patient ?",
                                        a: "Utilisez la barre de recherche globale ou allez dans 'Mes Patients'. Sélectionnez le dossier pour voir l'historique des consultations, résultats labo et antécédents familiaux."
                                    },
                                    {
                                        q: "Puis-je modifier un diagnostic après validation ?",
                                        a: "Oui, les comptes rendus de consultation restent modifiables pendant 24 heures. Passé ce délai, toute modification nécessitera une note rectificative annexée au dossier."
                                    },
                                    {
                                        q: "Comment recevoir les alertes de résultats de laboratoire ?",
                                        a: "Assurez-vous que les notifications sont activées dans votre profil. Une puce rouge apparaîtra sur l'icône de cloche dès qu'un résultat d'analyse est transféré par le laboratoire."
                                    },
                                    {
                                        q: "Le patient n'apparaît pas dans ma file d'attente ?",
                                        a: "Vérifiez auprès de l'accueil si le patient a bien été enregistré pour le service 'Cardiologie'. Seuls les patients assignés à votre spécialité apparaissent dans votre queue active."
                                    }
                                ].map((faq, i) => (
                                    <details key={i} className="group border-b border-slate-100 dark:border-slate-800 pb-4 last:border-none">
                                        <summary className="flex justify-between items-center cursor-pointer list-none py-2 text-sm font-bold text-titles dark:text-white hover:text-primary transition-colors">
                                            <span>{faq.q}</span>
                                            <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                                        </summary>
                                        <p className="pt-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic animate-in fade-in slide-in-from-top-2">
                                            {faq.a}
                                        </p>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-12">
                        <div className="bg-gradient-to-br from-primary to-[#35577D] rounded-[2.5rem] p-12 text-white shadow-xl shadow-primary/20 flex flex-col md:flex-row items-center gap-10">
                            <div className="size-24 rounded-[2rem] bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[50px]">emergency_share</span>
                            </div>
                            <div className="flex-1 flex flex-col gap-4 text-center md:text-left">
                                <h4 className="text-2xl font-black uppercase italic tracking-tight">Besoin d'aide immédiate ?</h4>
                                <p className="text-sm font-bold text-white/80 leading-relaxed">
                                    En cas de blocage technique empêchant une consultation, contactez le Service Informatique interne (Poste 405) ou utilisez le bouton ci-dessous pour une prise en main à distance.
                                </p>
                            </div>
                            <button className="h-14 px-10 bg-white text-primary rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg hover:scale-[1.05] transition-all shrink-0">
                                Contacter le Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default AideMedecin;
