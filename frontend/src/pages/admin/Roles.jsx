import React, { useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';

const AdminRoles = () => {
    const [selectedRole, setSelectedRole] = useState('admin');

    const roles = [
        { id: 'admin', nom: 'Administrateur', icon: 'shield_person' },
        { id: 'accueil', nom: 'Accueil / Réception', icon: 'person_pin_circle' },
        { id: 'medecin', nom: 'Médecin / Praticien', icon: 'stethoscope' },
        { id: 'patient', nom: 'Patient (Portail)', icon: 'person' },
    ];

    const permissions = [
        {
            category: 'Dossier Médical', items: [
                { n: 'Lire Dossier', d: 'Permet de consulter le contenu complet du dossier médical patient.', checked: true },
                { n: 'Modifier Dossier', d: "Permet d'ajouter des notes cliniques et de modifier les informations vitales.", checked: true },
                { n: 'Supprimer Dossier', d: "Action critique permettant d'archiver ou supprimer un dossier du système.", checked: false },
            ]
        },
        {
            category: 'Agenda & Rendez-vous', items: [
                { n: 'Créer Rendez-vous', d: "Planifier de nouvelles consultations dans l'agenda des praticiens.", checked: true },
                { n: 'Annuler Rendez-vous', d: "Supprimer ou marquer comme absent une consultation existante.", checked: true },
            ]
        },
        {
            category: 'Administration Système', items: [
                { n: 'Gérer Utilisateurs', d: "Création, modification et désactivation des comptes du personnel.", checked: true },
                { n: 'Assigner Rôles', d: "Attribution des niveaux de permissions et rôles aux employés.", checked: true },
                { n: 'Accès aux Logs', d: "Consultation des journaux d'audit et de sécurité (HIPAA compliance).", checked: true },
                { n: 'Configuration API', d: "Gestion des clés d'API et des intégrations tierces.", checked: false },
            ]
        }
    ];

    const getRoleLabel = (roleId) => {
        const role = roles.find(r => r.id === roleId);
        return role ? role.nom : '';
    };

    return (
        <AdminLayout>
            <div className="p-4 md:p-10 max-w-[1600px] mx-auto w-full flex flex-col gap-6 md:gap-8">
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-titles dark:text-white uppercase italic transition-all">Gestion des Rôles</h2>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 italic font-medium">
                            Configuration pour : <span className="font-bold text-primary">{getRoleLabel(selectedRole)}</span>
                        </p>
                    </div>
                    <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none rounded-xl h-12 px-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-titles dark:text-white text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            Réinitialiser
                        </button>
                        <button className="flex-1 sm:flex-none flex items-center justify-center rounded-xl h-12 px-6 bg-primary text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 transition-all gap-2">
                            <span className="material-symbols-outlined text-[20px]">check_circle</span> Enregistrer
                        </button>
                    </div>
                </div>

                {/* Roles Selector */}
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                    {roles.map(role => (
                        <button
                            key={role.id}
                            onClick={() => setSelectedRole(role.id)}
                            className={`flex items-center gap-3 px-6 py-4 rounded-[1.25rem] transition-all shrink-0 border-2 ${selectedRole === role.id
                                ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20'
                                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-primary/50'
                                }`}
                        >
                            <span className={`material-symbols-outlined text-[22px] ${selectedRole === role.id ? 'text-white' : 'text-primary'}`}>{role.icon}</span>
                            <span className={`text-[13px] uppercase tracking-wide ${selectedRole === role.id ? 'font-black' : 'font-bold'}`}>{role.nom}</span>
                        </button>
                    ))}
                </div>

                {/* Permissions Table */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[300px]">Permission</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Description</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center w-[150px]">Accès</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {permissions.map((group, idx) => (
                                    <React.Fragment key={idx}>
                                        <tr className="bg-primary/5 dark:bg-primary/10">
                                            <td className="px-6 py-2 text-xs font-bold text-primary uppercase" colSpan="3">{group.category}</td>
                                        </tr>
                                        {group.items.map((it, i) => (
                                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 font-bold text-sm text-titles dark:text-white">{it.n}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-medium">{it.d}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        defaultChecked={it.checked}
                                                        className="size-5 rounded-lg border-slate-200 dark:border-slate-700 text-primary focus:ring-primary focus:ring-offset-0 transition-all accent-primary cursor-pointer"
                                                        type="checkbox"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminRoles;
