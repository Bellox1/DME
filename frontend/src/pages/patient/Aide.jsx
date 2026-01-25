import React, { useState } from 'react';
import PatientLayout from '../../components/layouts/PatientLayout';

const PatientAide = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaq, setOpenFaq] = useState(null);

    const categories = [
        { id: 'dme', title: 'Comprendre le DME', icon: 'account_tree', color: 'text-blue-500', bg: 'bg-blue-50', darkBg: 'dark:bg-blue-500/10' },
        { id: 'consultation', title: 'Parcours de Soin', icon: 'medical_services', color: 'text-primary', bg: 'bg-primary/5', darkBg: 'dark:bg-primary/10' },
        { id: 'prescription', title: 'Ordonnances & Soins', icon: 'prescriptions', color: 'text-purple-500', bg: 'bg-purple-50', darkBg: 'dark:bg-purple-500/10' },
        { id: 'results', title: 'Analyses & Examens', icon: 'lab_research', color: 'text-orange-500', bg: 'bg-orange-50', darkBg: 'dark:bg-orange-500/10' },
    ];

    const faqs = [
        {
            category: 'dme',
            question: "Qu'est-ce que le Dossier Médical Électronique (DME) ?",
            answer: "Le DME est votre carnet de santé numérique unique. Il centralise toute votre vie médicale : antécédents, allergies, consultations, ordonnances et résultats d'examens. Contrairement au carnet papier, il est accessible en permanence par vous et les professionnels de santé que vous autorisez, garantissant une meilleure coordination de vos soins."
        },
        {
            category: 'consultation',
            question: "Comment se déroule le suivi d'une consultation sur la plateforme ?",
            answer: "Une consultation suit trois étapes : 1. La prise de rendez-vous. 2. La séance médicale (présentielle ou télé-consultation). 3. La clôture, où le médecin rédige son compte-rendu et génère vos ordonnances. Une fois clôturée, la consultation devient une pièce immuable de votre historique médical."
        },
        {
            category: 'prescription',
            question: "Mes ordonnances numériques sont-elles valables en pharmacie ?",
            answer: "Oui. Les ordonnances générées sur le DME sont signées numériquement et possèdent un code de vérification unique. Elles ont la même valeur légale qu'une ordonnance papier. Vous pouvez les présenter sur votre smartphone ou les imprimer si nécessaire."
        },
        {
            category: 'results',
            question: "Pourquoi mes résultats d'analyses ne sont-ils pas affichés immédiatement ?",
            answer: "Un résultat d'analyse ou d'examen doit d'abord être validé techniquement par le laboratoire, puis interprété médicalement par votre médecin prescripteur. Pour votre sécurité, certains résultats ne sont rendus visibles qu'après que votre médecin a pu en prendre connaissance pour vous les expliquer."
        },
        {
            category: 'dme',
            question: "Qui a le droit de modifier mon dossier médical ?",
            answer: "Seuls les médecins inscrits à l'Ordre et que vous avez consultés peuvent ajouter des notes cliniques ou des actes à votre dossier. Vous-même n'avez pas le droit de modifier les actes médicaux (pour garantir l'intégrité de l'expertise), mais vous pouvez consulter l'intégralité de ce qui est écrit."
        },
        {
            category: 'consultation',
            question: "Comment le système assure-t-il la continuité de mes soins ?",
            answer: "Le DME permet à chaque nouveau spécialiste que vous consultez d'avoir une vision globale de votre parcours. Par exemple, un cardiologue pourra voir les résultats de votre dernière prise de sang demandée par votre généraliste, évitant ainsi les examens redondants et les interactions médicamenteuses dangereuses."
        }
    ];

    const filteredFaqs = faqs.filter(f =>
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <PatientLayout>
            <div className="p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-16 transition-all duration-[800ms]">
                {/* Hero Search Section */}
                <div className="relative pt-8 pb-4">
                    <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                            Comprendre le Système DME
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-titles dark:text-white tracking-tight leading-[1.1]">
                            Maîtrisez votre <br /> <span className="text-primary">Espace Santé Numérique</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
                            Tout savoir sur le fonctionnement du Dossier Médical et votre parcours de soin.
                        </p>

                        <div className="w-full max-w-2xl mt-4 relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[24px]">search</span>
                            <input
                                type="text"
                                placeholder="Rechercher un concept (Dossier, Ordonnance, Validation...)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-16 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 focus:border-primary/30 rounded-3xl pl-16 pr-6 text-sm font-bold shadow-2xl shadow-black/5 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10 blur-3xl rounded-full"></div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {categories.map((cat) => (
                        <button key={cat.id} className="flex flex-col items-start p-8 rounded-[2.5rem] bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] shadow-sm hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 group text-left">
                            <div className={`size-14 rounded-2xl ${cat.bg} ${cat.darkBg} flex items-center justify-center ${cat.color} mb-6 group-hover:scale-110 transition-transform`}>
                                <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
                            </div>
                            <span className="text-xs font-black text-titles dark:text-white uppercase tracking-[0.15em] mb-2">{cat.title}</span>
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Découvrir les logiques de fonctionnement...</p>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* FAQ Section */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-black text-titles dark:text-white tracking-tight">Questions & Logiques Médicales</h2>
                        </div>

                        <div className="space-y-4">
                            {filteredFaqs.map((faq, i) => (
                                <div
                                    key={i}
                                    className={`rounded-[2rem] border transition-all duration-300 overflow-hidden ${openFaq === i
                                        ? 'bg-white dark:bg-[#1c2229] border-primary/30 shadow-xl shadow-primary/5'
                                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800'}`}
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full flex items-center justify-between p-7 text-left outline-none"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="flex flex-col gap-1 items-center justify-center shrink-0">
                                                <span className="text-[10px] font-black text-primary/40 leading-none">{i + 1}</span>
                                                <div className={`w-3 h-0.5 rounded-full ${openFaq === i ? 'bg-primary' : 'bg-slate-300'}`}></div>
                                            </div>
                                            <span className={`text-[15px] font-bold ${openFaq === i ? 'text-primary' : 'text-titles dark:text-white'}`}>{faq.question}</span>
                                        </div>
                                        <div className={`size-10 rounded-full flex items-center justify-center transition-all duration-300 ${openFaq === i ? 'bg-primary text-white rotate-180' : 'bg-slate-200/50 dark:bg-slate-800 text-slate-400'}`}>
                                            <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                        </div>
                                    </button>

                                    {openFaq === i && (
                                        <div className="px-14 pb-10 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="h-px bg-slate-100 dark:bg-slate-800 mb-8 w-full"></div>
                                            <p className="text-[14px] text-slate-600 dark:text-slate-400 font-medium leading-[1.8] max-w-2xl">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Educational Sidebar */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 size-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <span className="material-symbols-outlined text-primary text-4xl mb-6">verified_user</span>
                            <h3 className="text-xl font-black mb-4 relative z-10 tracking-tight">Valeur Probante</h3>
                            <p className="text-sm text-slate-400 font-medium mb-6 leading-relaxed relative z-10">
                                Chaque acte enregistré dans votre DME est certifié. Le système garantit qu'aucune donnée médicale ne peut être falsifiée, assurant une confiance totale pour vos médecins.
                            </p>
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                                <span className="material-symbols-outlined text-green-500">lock</span>
                                <span className="text-[10px] font-black uppercase text-slate-300 tracking-wider">Données Cryptées</span>
                            </div>
                        </div>

                        <div className="p-8 rounded-[2.5rem] bg-primary text-white flex flex-col gap-6 shadow-xl shadow-primary/20">
                            <h4 className="text-lg font-black tracking-tight leading-snug">Besoin d'un guide d'utilisation ?</h4>
                            <p className="text-xs text-white/80 font-medium leading-relaxed">
                                Si vous souhaitez une formation plus approfondie sur l'outil, vous pouvez télécharger notre guide patient complet.
                            </p>
                            <button className="flex items-center justify-center gap-2 py-4 bg-white text-primary rounded-2xl font-black text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                                <span className="material-symbols-outlined text-[18px]">download</span>
                                TÉLÉCHARGER LE PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
};

export default PatientAide;
