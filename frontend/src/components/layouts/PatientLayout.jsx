import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import Logo from '../common/Logo';
import patientService from '../../services/patient/patientService';

const PatientLayout = ({ children }) => {
    const location = useLocation();
    const dropdownRef = useRef(null);
    const switchRef = useRef(null);

    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        const saved = localStorage.getItem('sidebar-expanded-patient');
        return saved === null ? true : saved === 'true';
    });
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSwitchOpen, setIsSwitchOpen] = useState(false);

    // Informations de l'utilisateur connecté
    const [user] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : { nom: 'Utilisateur', prenom: '', role: 'patient' };
    });

    const [profiles, setProfiles] = useState([]);
    const [activeProfile, setActiveProfile] = useState(() => {
        const saved = localStorage.getItem('active-patient-profile');
        return saved ? JSON.parse(saved) : { id: null, nom_affichage: 'Vue d\'ensemble', type: 'Global' };
    });

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Charger les notifications
                const notifs = await patientService.getNotifications();
                setNotifications(notifs);

                // Charger les profils réels
                const fetchedProfils = await patientService.getProfils();
                const profilList = fetchedProfils.map(p => ({
                    ...p,
                    initial: p.nom_affichage.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
                    color: p.type === 'Titulaire' ? 'bg-primary' : (p.type === 'Enfant' ? 'bg-blue-500' : 'bg-slate-400')
                }));
                setProfiles(profilList);

                // Si aucun profil actif n'est en mémoire, on met le Titulaire (le premier)
                if (!localStorage.getItem('active-patient-profile')) {
                    if (profilList.length > 0) setActiveProfile(profilList[0]);
                } else {
                    // Vérifier que le profil en mémoire existe toujours dans la liste
                    const saved = JSON.parse(localStorage.getItem('active-patient-profile'));
                    const exists = profilList.find(p => p.id === saved.id);
                    if (!exists && profilList.length > 0) setActiveProfile(profilList[0]);
                }
            } catch (error) {
                console.error("Erreur chargement données initiales sidebar", error);
            }
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        localStorage.setItem('sidebar-expanded-patient', isSidebarOpen);
    }, [isSidebarOpen]);

    useEffect(() => {
        if (activeProfile) {
            localStorage.setItem('active-patient-profile', JSON.stringify(activeProfile));
            // Déclencher un événement personnalisé pour notifier les pages (le Dashboard) du changement
            window.dispatchEvent(new CustomEvent('patientProfileChanged', { detail: activeProfile }));
        }
    }, [activeProfile]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (switchRef.current && !switchRef.current.contains(event.target)) {
                setIsSwitchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    // Menu structure for Patients
    const menuSections = [
        {
            title: 'Menu',
            items: [
                { path: '/patient', icon: 'dashboard', label: 'Tableau de bord' },
                { path: '/patient/activites', icon: 'history', label: 'Activités' },
                { path: '/patient/consultations', icon: 'calendar_month', label: 'Consultations' },
                { path: '/patient/ordonnances', icon: 'prescriptions', label: 'Ordonnances' },
            ]
        },
        {
            title: 'Espace Santé',
            items: [
                { path: `/patient/dossier${activeProfile?.id ? `/${activeProfile.id}` : ''}`, icon: 'folder_shared', label: 'Dossier Médical' },
            ]
        },
        {
            title: 'Compte',
            items: [
                { path: '/patient/profil', icon: 'person', label: 'Mon Profil' },
                { path: '/patient/aide-patient', icon: 'support_agent', label: 'Aide' },
            ]
        }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-[800ms]">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#1c2229] border-r border-slate-200 dark:border-[#2d363f] flex flex-col p-4 shrink-0 transition-all duration-[400ms] ease-in-out transform ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full lg:translate-x-0 lg:w-20'
                    }`}
            >
                <div className="flex flex-col h-full overflow-hidden">
                    {/* Logo Section */}
                    <div className={`mb-8 transition-all duration-300 ${isSidebarOpen ? 'px-2' : 'flex justify-center'}`}>
                        <Logo size="lg" showText={isSidebarOpen} />
                    </div>

                    <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1">
                        {menuSections.map((section, idx) => (
                            <div key={idx} className="flex flex-col gap-1.5">
                                {isSidebarOpen && (
                                    <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] pl-4 mb-1">
                                        {section.title}
                                    </span>
                                )}
                                {section.items.map(item => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => { if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
                                        className={`flex items-center rounded-xl transition-all duration-200 group relative ${isSidebarOpen ? 'px-4 py-2.5 gap-3' : 'p-3 justify-center'
                                            } ${isActive(item.path)
                                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                            }`}
                                        title={!isSidebarOpen ? item.label : ''}
                                    >
                                        <span className={`material-symbols-outlined text-[22px] shrink-0 transition-colors duration-200 ${isActive(item.path)
                                            ? ''
                                            : 'text-slate-400 group-hover:text-primary'
                                            }`}>
                                            {item.icon}
                                        </span>
                                        {isSidebarOpen && (
                                            <p className="text-[13px] tracking-wide whitespace-nowrap font-semibold">
                                                {item.label}
                                            </p>
                                        )}
                                        {!isSidebarOpen && isActive(item.path) && (
                                            <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                        {isSidebarOpen && (
                            <div className="px-2">
                                <ThemeToggle />
                            </div>
                        )}

                        <button
                            onClick={handleLogout}
                            className={`flex items-center rounded-xl h-11 bg-slate-50 dark:bg-slate-800 text-titles dark:text-white text-[13px] font-bold transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 ${isSidebarOpen ? 'px-4 gap-2 w-full' : 'justify-center w-full'
                                }`}
                            title={!isSidebarOpen ? 'Déconnexion' : ''}
                        >
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                            {isSidebarOpen && <span className="whitespace-nowrap">Déconnexion</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay mobile */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Main Content */}
            <main className={`flex-1 flex flex-col overflow-y-auto relative transition-all duration-[400ms] ${isSidebarOpen ? 'lg:pl-72' : 'lg:pl-20'}`}>
                {/* Header */}
                <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-all duration-[400ms]">
                    <div className="flex items-center justify-between px-4 md:px-10 py-4">
                        <div className="flex items-center gap-6 flex-1">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-primary/10 hover:text-primary transition-all border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0"
                            >
                                <span className="material-symbols-outlined text-[24px]">
                                    {isSidebarOpen ? 'menu_open' : 'menu'}
                                </span>
                            </button>

                            <div className="flex-1 max-w-2xl hidden sm:block">
                                <label className="flex items-center w-full h-11 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 group ring-1 ring-slate-200 dark:ring-slate-700 focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-[400ms]">
                                    <span className="material-symbols-outlined text-slate-400 mr-3 text-[22px]">search</span>
                                    <input
                                        className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-titles dark:text-white text-sm placeholder:text-slate-400"
                                        placeholder="Rechercher..."
                                        type="text"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 md:gap-6 ml-3 md:ml-6">
                            {!isSidebarOpen && (
                                <div className="transition-all">
                                    <ThemeToggle />
                                </div>
                            )}

                            <div className="flex items-center gap-4 relative" ref={switchRef}>
                                <button
                                    onClick={() => setIsSwitchOpen(!isSwitchOpen)}
                                    className={`hidden md:flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-200 ${isSwitchOpen ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary/30'}`}
                                >
                                    <div className={`size-7 rounded-lg ${activeProfile?.color || 'bg-slate-400'} flex items-center justify-center text-[10px] font-black text-white`}>
                                        {activeProfile?.initial}
                                    </div>
                                    <div className="flex flex-col items-start leading-tight">
                                        <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Dossier Actif</span>
                                        <span className="text-[12px] font-bold whitespace-nowrap">{activeProfile?.nom_affichage}</span>
                                    </div>
                                    <span className="material-symbols-outlined text-[18px] text-slate-400">swap_vert</span>
                                </button>

                                {isSwitchOpen && (
                                    <div className="absolute top-[calc(100%+12px)] left-0 w-64 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-2xl shadow-2xl z-[60] py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <div className="px-4 py-2 mb-1 border-b border-slate-100 dark:border-slate-800">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Changer de dossier</p>
                                        </div>
                                        {profiles.map(p => (
                                            <button
                                                key={p.id === null ? 'global' : p.id}
                                                onClick={() => {
                                                    setActiveProfile(p);
                                                    setIsSwitchOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-left ${activeProfile?.id === p.id ? 'bg-primary/5 text-primary' : 'text-titles dark:text-white'}`}
                                            >
                                                <div className={`size-8 rounded-lg ${p.color} flex items-center justify-center text-[10px] font-black text-white shrink-0`}>
                                                    {p.initial}
                                                </div>
                                                <div className="flex flex-col items-start leading-tight">
                                                    <span className="text-xs font-bold">{p.nom_affichage}</span>
                                                    <span className="text-[9px] font-medium uppercase tracking-widest text-slate-400">{p.type}</span>
                                                </div>
                                                {activeProfile?.id === p.id && (
                                                    <span className="material-symbols-outlined text-[18px] ml-auto">check_circle</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

                            <div className="flex items-center gap-4 relative" ref={dropdownRef}>
                                <Link
                                    to="/patient/notifications"
                                    className="relative p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-titles dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0"
                                >
                                    <span className="material-symbols-outlined text-[22px]">notifications</span>
                                    {notifications.filter(n => n.isUnread).length > 0 && (
                                        <span className="absolute -top-1 -right-1 size-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
                                            {notifications.filter(n => n.isUnread).length}
                                        </span>
                                    )}
                                </Link>
                                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>

                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-all duration-200 ${isProfileOpen ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <div className="bg-primary size-9 rounded-full flex items-center justify-center overflow-hidden shadow-sm shadow-primary/20 text-white text-xs font-black">
                                        {(user.prenom?.[0] || '')}{(user.nom?.[0] || '')}
                                    </div>
                                    <span className="material-symbols-outlined text-[18px] text-slate-400 transition-transform duration-300" style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                        expand_more
                                    </span>
                                </button>

                                {/* Dropdown Profile */}
                                {isProfileOpen && (
                                    <div className="absolute top-[calc(100%+12px)] right-0 w-72 bg-white dark:bg-[#1c2229] border border-slate-200 dark:border-[#2d363f] rounded-2xl shadow-2xl shadow-black/10 z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-5 border-b border-slate-100 dark:border-[#2d363f] bg-slate-50/50 dark:bg-[#252c35]/50">
                                            <div className="flex items-center gap-3">
                                                <div className="size-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-black">
                                                    {(user.prenom?.[0] || '')}{(user.nom?.[0] || '')}
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-bold text-titles dark:text-white"><span className="text-secondary">{user.prenom}</span> {user.nom}</p>
                                                    <p className="text-[11px] text-[#6c757f] font-medium">Patient</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <Link to="/patient/profil" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#252c35] group transition-all" onClick={() => setIsProfileOpen(false)}>
                                                <div className="size-10 rounded-lg bg-slate-100 dark:bg-[#15191d] group-hover:bg-primary/10 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[20px] text-slate-500 group-hover:text-primary">person</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-titles dark:text-white">Mon Profil</span>
                                                    <span className="text-[10px] text-[#6c757f]">Gérer ma famille</span>
                                                </div>
                                            </Link>
                                            <Link to="/patient/aide-patient" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#252c35] group transition-all" onClick={() => setIsProfileOpen(false)}>
                                                <div className="size-10 rounded-lg bg-slate-100 dark:bg-[#15191d] group-hover:bg-primary/10 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[20px] text-slate-500 group-hover:text-primary">support_agent</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-titles dark:text-white">Centre d'aide</span>
                                                    <span className="text-[10px] text-[#6c757f]">Besoin d'aide ?</span>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="p-2 border-t border-slate-100 dark:border-[#2d363f] bg-slate-50/30 dark:bg-slate-900/30">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-bold text-sm text-left"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">logout</span>
                                                <span>Se déconnecter</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Barre de recherche mobile */}
                    <div className="sm:hidden px-4 pb-4">
                        <label className="flex items-center w-full h-11 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 group ring-1 ring-slate-200 dark:ring-slate-700 focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-[400ms]">
                            <span className="material-symbols-outlined text-slate-400 mr-3 text-[22px]">search</span>
                            <input
                                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-titles dark:text-white text-sm placeholder:text-slate-400"
                                placeholder="Rechercher..."
                                type="text"
                            />
                        </label>
                    </div>
                </header>

                <div className="flex-1">
                    {children}
                </div>
            </main>
        </div >
    );
};

export default PatientLayout;
