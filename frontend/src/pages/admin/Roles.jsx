import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import api from '../../services/api';

const AdminRoles = () => {
    // Rôles statiques pour l'affichage (icônes et labels sympas)
    const uiRoles = [
        { key: 'admin', nom: 'Administrateur', icon: 'shield_person' },
        { key: 'accueil', nom: 'Accueil / Réception', icon: 'person_pin_circle' },
        { key: 'medecin', nom: 'Médecin / Praticien', icon: 'stethoscope' },
        { key: 'patient', nom: 'Patient (Portail)', icon: 'person' },
    ];

    const [selectedRoleKey, setSelectedRoleKey] = useState('admin');
    const [dbRoles, setDbRoles] = useState([]);
    const [dbPermissions, setDbPermissions] = useState([]);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    // Structure des permissions demandée (Design original)
    const permissionsStructure = [
        {
            category: 'Dossier Médical', items: [
                { n: 'Lire Dossier', d: 'Permet de consulter le contenu complet du dossier médical patient.', slugs: ['voir_patients', 'voir_enfants', 'voir_consultations', 'voir_prescriptions'] },
                { n: 'Modifier Dossier', d: "Permet d'ajouter des notes cliniques et de modifier les informations vitales.", slugs: ['creer_patients', 'modifier_patients', 'creer_enfants', 'modifier_enfants', 'creer_consultations', 'modifier_consultations', 'creer_prescriptions', 'modifier_prescriptions'] },
                { n: 'Supprimer Dossier', d: "Action critique permettant d'archiver ou supprimer un dossier du système.", slugs: ['supprimer_patients', 'supprimer_enfants', 'supprimer_consultations', 'supprimer_prescriptions'] },
            ]
        },
        {
            category: 'Agenda & Rendez-vous', items: [
                { n: 'Créer Rendez-vous', d: "Planifier de nouvelles consultations dans l'agenda des praticiens.", slugs: ['voir_rdvs', 'creer_rdvs', 'voir_demandes', 'creer_demandes'] },
                { n: 'Annuler Rendez-vous', d: "Supprimer ou marquer comme absent une consultation existante.", slugs: ['modifier_rdvs', 'supprimer_rdvs', 'modifier_demandes', 'supprimer_demandes'] },
            ]
        },
        {
            category: 'Administration Système', items: [
                { n: 'Gérer Utilisateurs', d: "Création, modification et désactivation des comptes du personnel.", slugs: ['voir_utilisateurs', 'creer_utilisateurs', 'modifier_utilisateurs'] },
                { n: 'Assigner Rôles', d: "Attribution des niveaux de permissions et rôles aux employés.", slugs: ['voir_roles', 'modifier_roles', 'voir_permissions', 'modifier_permissions'] },
                { n: 'Accès aux Logs', d: "Consultation des journaux d'audit et de sécurité.", slugs: ['voir_tracabilites'] },
                { n: 'Configuration API', d: "Gestion des clés d'API et des intégrations tierces.", slugs: [] },
            ]
        }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/permissions');
            setDbRoles(response.data.roles);
            setDbPermissions(response.data.permissions);
            setRolePermissions(response.data.rolePermissions);
        } catch (error) {
            console.error("Erreur API:", error);
            setMessage({ type: 'error', text: 'Erreur de chargement des données.' });
        } finally {
            setLoading(false);
        }
    };

    const getRoleId = () => {
        if (!dbRoles || dbRoles.length === 0) return null;
        const role = dbRoles.find(r => r.nom.toLowerCase() === selectedRoleKey.toLowerCase());
        return role ? Number(role.id) : null;
    };

    const isChecked = (item) => {
        const roleId = getRoleId();
        if (!roleId || !item.slugs || item.slugs.length === 0) return false;

        const idsToCheck = dbPermissions
            .filter(p => item.slugs.includes(p.nom))
            .map(p => Number(p.id));

        if (idsToCheck.length === 0) return false;

        // Returns true if ALL permissions in the group are present for the role
        return idsToCheck.every(pid =>
            rolePermissions.some(rp => Number(rp.role_id) === roleId && Number(rp.permission_id) === pid)
        );
    };

    const handleToggle = (item) => {
        const roleId = getRoleId();
        // Prevent editing Admin role in UI as it has bypass in backend anyway
        if (!roleId || selectedRoleKey.toLowerCase() === 'admin') return;

        const idsToToggle = dbPermissions
            .filter(p => item.slugs.includes(p.nom))
            .map(p => Number(p.id));

        if (idsToToggle.length === 0) return;

        const alreadyChecked = isChecked(item);

        setRolePermissions(prev => {
            const otherRolesPerms = prev.filter(rp => Number(rp.role_id) !== roleId);
            const currentRolePerms = prev.filter(rp => Number(rp.role_id) === roleId);

            if (alreadyChecked) {
                // If every permission was checked, we remove them all for this group
                const remainingPerms = currentRolePerms.filter(rp => !idsToToggle.includes(Number(rp.permission_id)));
                return [...otherRolesPerms, ...remainingPerms];
            } else {
                // If not all were checked, we add all of them (avoiding duplicates)
                const existingIds = currentRolePerms.map(rp => Number(rp.permission_id));
                const missingIds = idsToToggle.filter(id => !existingIds.includes(id));
                const newEntries = missingIds.map(pid => ({
                    role_id: roleId,
                    permission_id: pid
                }));
                return [...prev, ...newEntries];
            }
        });
    };

    const handleSave = async () => {
        const roleId = getRoleId();
        if (!roleId || selectedRoleKey === 'admin') return;

        try {
            setSaving(true);
            setMessage(null);

            const permissionIds = rolePermissions
                .filter(rp => rp.role_id === roleId)
                .map(rp => rp.permission_id);

            await api.post('/admin/permissions', {
                role_id: roleId,
                permission_ids: permissionIds
            });

            setMessage({ type: 'success', text: 'Permissions enregistrées !' });
        } catch (error) {
            setMessage({ type: 'error', text: "Erreur lors de l'enregistrement." });
        } finally {
            setSaving(false);
        }
    };

    const getRoleLabel = () => {
        const role = uiRoles.find(r => r.key === selectedRoleKey);
        return role ? role.nom : '';
    };

    if (loading) return (
        <AdminLayout>
            <div className="p-20 text-center animate-pulse text-primary font-bold">Initialisation de la sécurité...</div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="p-4 md:p-10 max-w-[1600px] mx-auto w-full flex flex-col gap-6 md:gap-8">
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-titles dark:text-white uppercase italic">Gestion des Rôles</h2>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 italic">
                            Configuration pour : <span className="font-bold text-primary">{getRoleLabel()}</span>
                        </p>
                    </div>
                    <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
                        <button onClick={fetchData} className="flex-1 sm:flex-none rounded-xl h-12 px-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-titles dark:text-white text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                            Actualiser
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || selectedRoleKey === 'admin'}
                            className="flex-1 sm:flex-none flex items-center justify-center rounded-xl h-12 px-6 bg-primary text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all gap-2 disabled:opacity-50"
                        >
                            {saving ? '...' : <><span className="material-symbols-outlined text-[20px]">check_circle</span> Enregistrer</>}
                        </button>
                    </div>
                </div>

                {message && (
                    <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        <span className="material-symbols-outlined">{message.type === 'success' ? 'verified' : 'error'}</span>
                        {message.text}
                    </div>
                )}

                {/* Roles Selector */}
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                    {uiRoles.map(role => (
                        <button
                            key={role.key}
                            onClick={() => { setSelectedRoleKey(role.key); setMessage(null); }}
                            className={`flex items-center gap-3 px-6 py-4 rounded-[1.25rem] transition-all shrink-0 border-2 ${selectedRoleKey === role.key
                                ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105'
                                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                                }`}
                        >
                            <span className={`material-symbols-outlined text-[22px] ${selectedRoleKey === role.key ? 'text-white' : 'text-primary'}`}>{role.icon}</span>
                            <span className={`text-[13px] uppercase tracking-wide ${selectedRoleKey === role.key ? 'font-black' : 'font-bold'}`}>{role.nom}</span>
                        </button>
                    ))}
                </div>

                {/* Permissions Categories */}
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
                                {permissionsStructure.map((group, idx) => (
                                    <React.Fragment key={idx}>
                                        <tr className="bg-primary/5 dark:bg-primary/10">
                                            <td className="px-8 py-2 text-xs font-black text-primary uppercase italic" colSpan="3">{group.category}</td>
                                        </tr>
                                        {group.items.map((it, i) => (
                                            <tr
                                                key={i}
                                                onClick={() => handleToggle(it)}
                                                className={`transition-colors cursor-pointer ${selectedRoleKey === 'admin' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50/50'}`}
                                            >
                                                <td className="px-8 py-5 font-bold text-sm text-titles dark:text-white">{it.n}</td>
                                                <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{it.d}</td>
                                                <td className="px-8 py-5 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked(it)}
                                                        readOnly // Handled by tr onClick
                                                        disabled={selectedRoleKey === 'admin'}
                                                        className="size-6 rounded-lg border-slate-300 text-primary transition-all accent-primary cursor-pointer disabled:opacity-20"
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
