import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layouts/AdminLayout';
import api from '../../services/api';

const AdminUtilisateurs = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('Tous');
    const [filterSexe, setFilterSexe] = useState('Tous');

    // State for Edit Modal
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        nom: '', prenom: '', tel: '', whatsapp: '', role: '', sexe: '', ville: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/users');
            setUsers(response.data);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des utilisateurs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

        try {
            await api.delete(`/admin/users/${userId}`);
            setUsers(users.filter(u => u.id !== userId));
        } catch (err) {
            alert('Erreur lors de la suppression');
            console.error(err);
        }
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setEditFormData({
            nom: user.nom || '',
            prenom: user.prenom || '',
            tel: user.tel || '',
            whatsapp: user.whatsapp || '',
            role: user.role || '',
            sexe: user.sexe || 'Homme',
            ville: user.ville || ''
        });
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.put(`/admin/users/${editingUser.id}`, editFormData);
            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur lors de la modification');
        } finally {
            setIsSaving(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.nom + ' ' + user.prenom).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'Tous' || user.type === filterType;
        const matchesSexe = filterSexe === 'Tous' || user.sexe === filterSexe;
        return matchesSearch && matchesType && matchesSexe;
    });

    const stats = [
        { label: 'Total utilisateurs', value: users.length.toString(), icon: 'group' },
        { label: 'Adultes', value: users.filter(u => u.type === 'Adulte').length.toString(), icon: 'person' },
        { label: 'Enfants', value: users.filter(u => u.type === 'Enfant').length.toString(), icon: 'child_care' },
        { label: 'Hommes', value: users.filter(u => u.sexe === 'M' || u.sexe === 'Homme').length.toString(), icon: 'man' },
        { label: 'Femmes', value: users.filter(u => u.sexe === 'F' || u.sexe === 'Femme').length.toString(), icon: 'woman' },
    ];

    return (
        <AdminLayout>
            <div className="p-4 md:p-10 max-w-[1600px] mx-auto w-full flex flex-col gap-8 transition-all">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-titles dark:text-white uppercase italic">Gestion des Utilisateurs</h2>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 italic font-medium">Contrôle complet de la base de données</p>
                    </div>
                    <Link to="/admin/inscription" className="w-full sm:w-auto flex items-center justify-center rounded-xl h-12 px-6 bg-primary text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all gap-2">
                        <span className="material-symbols-outlined text-[20px]">person_add</span> Nouvel utilisateur
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="rounded-xl p-3 bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined text-2xl font-bold">{stat.icon}</span>
                                </div>
                            </div>
                            <p className="text-3xl font-black text-titles dark:text-white mb-1">{stat.value}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 w-full lg:max-w-md">
                        <label className="flex items-center w-full h-12 bg-white dark:bg-slate-900 rounded-xl px-4 border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-primary/40 transition-all shadow-sm">
                            <span className="material-symbols-outlined text-slate-400 mr-3 text-[22px]">search</span>
                            <input
                                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-titles dark:text-white text-sm placeholder:text-slate-400 font-medium"
                                placeholder="Rechercher par nom ou prénom..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="flex flex-wrap gap-4 flex-1">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="flex-1 min-w-[150px] h-12 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-titles dark:text-white focus:ring-2 focus:ring-primary/40 outline-none cursor-pointer"
                        >
                            <option value="Tous">Tous les types</option>
                            <option value="Adulte">Adulte</option>
                            <option value="Enfant">Enfant</option>
                        </select>
                        <select
                            value={filterSexe}
                            onChange={(e) => setFilterSexe(e.target.value)}
                            className="flex-1 min-w-[150px] h-12 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-titles dark:text-white focus:ring-2 focus:ring-primary/40 outline-none cursor-pointer"
                        >
                            <option value="Tous">Tous les sexes</option>
                            <option value="Homme">Homme</option>
                            <option value="Femme">Femme</option>
                        </select>
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent shadow-lg"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-rose-600 text-sm font-bold flex items-center gap-4 animate-shake">
                        <span className="material-symbols-outlined">warning</span> {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ID</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Informations</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rôle & Type</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contact</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-8 py-5">
                                                <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500 uppercase tracking-tighter">ID-{user.id}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm text-titles dark:text-white capitalize">{user.nom} {user.prenom}</span>
                                                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium capitalize">{user.sexe}, {user.ville || 'Ville non spécifiée'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">{user.role}</span>
                                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{user.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-titles dark:text-white">{user.tel}</span>
                                                    {user.whatsapp && <span className="text-[11px] text-emerald-500 font-bold">WhatsApp: {user.whatsapp}</span>}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="size-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all shadow-sm"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="size-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all shadow-sm"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
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

                {/* Edit Modal */}
                {editingUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in transition-all">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in slide-in-from-bottom-8">
                            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                                <div>
                                    <h3 className="text-2xl font-black text-titles dark:text-white uppercase italic tracking-tight">Modifier Utilisateur</h3>
                                    <p className="text-sm text-slate-400 font-medium italic">Modification du compte ID-{editingUser.id}</p>
                                </div>
                                <button onClick={() => setEditingUser(null)} className="size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-titles transition-all">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <form className="p-8 space-y-6" onSubmit={handleEditSubmit}>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Nom</label>
                                        <input required name="nom" value={editFormData.nom} onChange={handleEditChange} className="h-12 rounded-xl border border-slate-200 dark:border-slate-800 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/40 outline-none bg-slate-50 dark:bg-slate-950 transition-all" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Prénom</label>
                                        <input required name="prenom" value={editFormData.prenom} onChange={handleEditChange} className="h-12 rounded-xl border border-slate-200 dark:border-slate-800 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/40 outline-none bg-slate-50 dark:bg-slate-950 transition-all" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Téléphone</label>
                                        <input name="tel" value={editFormData.tel} onChange={handleEditChange} className="h-12 rounded-xl border border-slate-200 dark:border-slate-800 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/40 outline-none bg-slate-50 dark:bg-slate-950 transition-all" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Ville</label>
                                        <input name="ville" value={editFormData.ville} onChange={handleEditChange} className="h-12 rounded-xl border border-slate-200 dark:border-slate-800 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/40 outline-none bg-slate-50 dark:bg-slate-950 transition-all" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Rôle</label>
                                        <select name="role" value={editFormData.role} onChange={handleEditChange} className="h-12 rounded-xl border border-slate-200 dark:border-slate-800 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/40 outline-none bg-slate-50 dark:bg-slate-950 cursor-pointer">
                                            <option value="admin">Administrateur</option>
                                            <option value="medecin">Médecin</option>
                                            <option value="accueil">Accueil</option>
                                            <option value="patient">Patient</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Sexe</label>
                                        <select name="sexe" value={editFormData.sexe} onChange={handleEditChange} className="h-12 rounded-xl border border-slate-200 dark:border-slate-800 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/40 outline-none bg-slate-50 dark:bg-slate-950 cursor-pointer">
                                            <option value="Homme">Homme</option>
                                            <option value="Femme">Femme</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={() => setEditingUser(null)} className="h-12 px-8 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-100 transition-all">Annuler</button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="h-12 px-10 rounded-xl bg-primary text-white font-black uppercase text-[11px] tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {isSaving ? 'Enregistrement...' : 'Sauvegarder les changements'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminUtilisateurs;
