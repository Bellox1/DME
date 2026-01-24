import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layouts/AdminLayout';
import { utilisateurService } from '../../services';

const AdminUtilisateurs = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await utilisateurService.getAllUtilisateurs();
                // Les données retournées sont des patients, on les traite comme des utilisateurs
                setUsers(data);
            } catch (err) {
                setError('Erreur lors du chargement des utilisateurs');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const stats = [
        { label: 'Total utilisateurs', value: users.length.toString(), icon: 'group' },
        { label: 'Adultes', value: users.filter(u => u.type === 'Adulte').length.toString(), icon: 'person' },
        { label: 'Enfants', value: users.filter(u => u.type === 'Enfant').length.toString(), icon: 'child_care' },
        { label: 'Hommes', value: users.filter(u => u.sexe === 'M' || u.sexe === 'Homme').length.toString(), icon: 'man' },
        { label: 'Femmes', value: users.filter(u => u.sexe === 'F' || u.sexe === 'Femme').length.toString(), icon: 'woman' },
    ];

    return (
        <AdminLayout>
            <div className="p-4 md:p-10 max-w-[1600px] mx-auto w-full flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-titles dark:text-white">Gestion des Utilisateurs</h2>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">Liste complète des comptes du système</p>
                    </div>
                    <Link to="/admin/inscription" className="w-full sm:w-auto flex items-center justify-center rounded-lg h-11 px-6 bg-primary text-white font-bold shadow-lg hover:opacity-90 transition-opacity gap-2">
                        <span className="material-symbols-outlined text-[20px]">person_add</span> Nouvel utilisateur
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="rounded-lg p-3 bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                                </div>
                            </div>
                            <p className="text-3xl font-black text-titles dark:text-white mb-1">{stat.value}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 w-full lg:max-w-md">
                        <label className="flex items-center w-full h-11 bg-white dark:bg-slate-900 rounded-xl px-4 border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-primary/40 transition-all">
                            <span className="material-symbols-outlined text-slate-400 mr-3 text-[22px]">search</span>
                            <input
                                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-titles dark:text-white text-sm placeholder:text-slate-400"
                                placeholder="Rechercher un utilisateur..."
                                type="text"
                            />
                        </label>
                    </div>
                    <div className="flex flex-wrap gap-4 flex-1">
                        <select className="flex-1 min-w-[150px] h-11 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-titles dark:text-white focus:ring-2 focus:ring-primary/40">
                            <option>Tous les types</option>
                            <option>Adulte</option>
                            <option>Enfant</option>
                        </select>
                        <select className="flex-1 min-w-[150px] h-11 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-titles dark:text-white focus:ring-2 focus:ring-primary/40">
                            <option>Tous les sexes</option>
                            <option>M</option>
                            <option>F</option>
                        </select>
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-600 dark:text-red-400 text-sm font-medium">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    /* Users Table */
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">ID</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Nom</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Type</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Sexe</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Téléphone</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="px-6 py-4 text-sm font-bold text-titles dark:text-white">P-{user.id}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-titles dark:text-white">
                                                {user.nom} {user.prenom}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 capitalize">{user.type}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{user.sexe}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{user.tel}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Modifier">
                                                        <span className="material-symbols-outlined text-[20px] text-slate-400">edit</span>
                                                    </button>
                                                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Supprimer">
                                                        <span className="material-symbols-outlined text-[20px] text-red-400">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </AdminLayout>
    );
};

export default AdminUtilisateurs;
