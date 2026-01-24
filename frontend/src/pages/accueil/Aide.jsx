import React, { useState } from 'react';
import ReceptionLayout from '../../components/layouts/ReceptionLayout';

const AideReception = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        {
            question: "Comment gérer un patient sans rendez-vous ?",
            answer: "Pour un patient sans RDV, utilisez le bouton 'Nouveau Patient' ou 'File d'attente'. Attribuez-lui un numéro de ticket et assignez-le à un médecin disponible en fonction de l'urgence."
        },
        {
            question: "Comment valider un paiement Mobile Money ?",
            answer: "Lorsqu'un patient paie via Mobile Money, attendez la confirmation sur le terminal dédié, puis saisissez le numéro de transaction dans l'interface de Caisse pour clôturer la facture."
        },
        {
            question: "Que faire en cas de doublon de dossier ?",
            answer: "Si vous trouvez deux dossiers pour le même patient, signalez-le immédiatement à l'administrateur système via l'onglet 'Support' pour qu'il puisse procéder à une fusion sécurisée."
        }
    ];

    return (
        <ReceptionLayout>
            <div className="p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-12 transition-all duration-[800ms]">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-black text-titles dark:text-white tracking-tight">Guide d'Utilisation Accueil</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Maîtrisez les outils de réception et de gestion des flux.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {faqs.map((faq, i) => (
                        <div key={i} className="p-8 rounded-[2rem] bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] shadow-sm">
                            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4">{faq.question}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{faq.answer}</p>
                        </div>
                    ))}
                </div>

                <div className="p-10 rounded-[3rem] bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-xl font-black tracking-tight">Besoin d'aide technique ?</h3>
                        <p className="text-slate-400 text-sm">Notre support IT est joignable sur le poste interne #999.</p>
                    </div>
                    <button className="h-14 px-10 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">POSTE #999</button>
                </div>
            </div>
        </ReceptionLayout>
    );
};

export default AideReception;
