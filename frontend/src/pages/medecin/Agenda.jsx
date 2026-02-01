import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DoctorLayout from '../../components/layouts/DoctorLayout';
import accueilService from '../../services/accueil/accueilService';
import medecinService from '../../services/medecin/medecinService';

const AgendaMedecin = () => {
    const [rdvs, setRdvs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [patients, setPatients] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weekDays, setWeekDays] = useState([]);

    // Générer les jours de la semaine courante
    useEffect(() => {
        const days = [];
        const today = new Date();
        // Commencer par lundi de la semaine courante
        const currentDay = today.getDay(); // 0 = Dimanche, 1 = Lundi
        const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // ajuster pour que lundi soit le premier jour

        const monday = new Date(today.setDate(diff));

        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            days.push(d);
        }
        setWeekDays(days);
        // Reset today pour selectedDate (car setDate modifie l'objet en place)
        setSelectedDate(new Date());
    }, []);

    const isSameDay = (d1, d2) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    const formatDateC = (date) => {
        const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        return days[date.getDay()];
    };

    useEffect(() => {
        const fetchAgenda = async () => {
            try {
                setLoading(true);
                const currentUser = JSON.parse(localStorage.getItem('user'));
                const medecinId = currentUser?.id;

                if (!medecinId) {
                    console.error("Aucun ID médecin trouvé");
                    return;
                }

                // Récupérer les RDVs du médecin (sans date = tous ou aujourd'hui selon backend, ici on demandera tout pour filtrer ou afficher)
                // Pour l'instant on ne filtre pas par date dans l'appel pour voir ce qui remonte
                const [patientsData, rdvsData] = await Promise.all([
                    accueilService.getPatients(),
                    medecinService.getAgenda(medecinId)
                ]);

                // Gestion des données patients
                setPatients(patientsData.data || patientsData);

                // Gestion des données RDVs
                // On s'assure que c'est un tableau
                const appointments = rdvsData.data || rdvsData;
                setRdvs(Array.isArray(appointments) ? appointments : []);

            } catch (error) {
                console.error('Erreur chargement agenda:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgenda();
    }, []);

    const getPatientName = (patientId) => {
        const patient = patients.find(p => p.id === parseInt(patientId));
        return patient ? `${patient.nom} ${patient.prenom}` : `Patient #${patientId}`;
    };

    // Filter RDVs by selected date
    const filteredRdvs = rdvs.filter(rdv => {
        if (!rdv.dateH_rdv) return false;
        const rdvDate = new Date(rdv.dateH_rdv);
        return isSameDay(rdvDate, selectedDate);
    });

    return (
        <DoctorLayout>
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-primary/10 text-primary rounded-xl material-symbols-outlined text-[20px]">calendar_month</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Planning Quotidien</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-titles dark:text-white tracking-tighter leading-none italic uppercase">
                            Agenda Médical
                        </h1>
                        <p className="text-base text-slate-500 dark:text-slate-400 font-medium italic">Gérez vos rendez-vous et optimisez votre temps de consultation.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-[#1c2229] p-2 rounded-3xl border border-slate-100 dark:border-[#2d363f] shadow-sm">
                        <button onClick={() => setSelectedDate(new Date())} className="px-8 py-3 rounded-2xl bg-primary text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">Aujourd'hui</button>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1c2229] border border-slate-100 dark:border-[#2d363f] rounded-[3rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
                    {/* Background Decorative Element */}
                    <div className="absolute top-0 right-0 size-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                    <div className="flex items-center justify-between mb-12 overflow-x-auto pb-6 gap-6 no-scrollbar relative z-10">
                        {weekDays.map((date, i) => {
                            const active = isSameDay(date, selectedDate);
                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDate(date)}
                                    className={`flex flex-col items-center gap-4 min-w-[100px] p-6 rounded-[2.5rem] transition-all duration-500 ${active ? 'bg-primary text-white shadow-2xl shadow-primary/30 ring-8 ring-primary/5 scale-110' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-titles dark:hover:text-white'}`}
                                >
                                    <span className="text-[11px] font-black uppercase tracking-widest">{formatDateC(date)}</span>
                                    <span className="text-2xl font-black italic tracking-tighter">{date.getDate()}</span>
                                    <div className={`size-1.5 rounded-full ${active ? 'bg-white' : 'bg-transparent'}`}></div>
                                </button>
                            )
                        })}
                    </div>

                    <div className="space-y-4 relative z-10">
                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                            </div>
                        ) : filteredRdvs.length === 0 ? (
                            <div className="py-20 text-center text-slate-400 font-bold italic">
                                Aucun rendez-vous planifié pour le {selectedDate.toLocaleDateString('fr-FR')}.
                            </div>
                        ) : (
                            filteredRdvs.sort((a, b) => new Date(a.dateH_rdv) - new Date(b.dateH_rdv)).map((rdv, i) => (
                                <div key={i} className={`group flex flex-col sm:flex-row items-center gap-6 md:gap-10 p-5 md:p-6 rounded-[2rem] border transition-all duration-500 bg-white dark:bg-[#1e252d] border-primary/20 shadow-xl shadow-primary/5 border-l-8 border-l-primary`}>
                                    <div className="min-w-[80px] text-lg font-black text-titles dark:text-white italic tracking-tighter drop-shadow-sm">
                                        {new Date(rdv.dateH_rdv).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    </div>

                                    <div className="flex-1 flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                            <span className="text-base font-black uppercase tracking-tighter italic text-titles dark:text-white">
                                                {getPatientName(rdv.patient_id)}
                                            </span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic">{rdv.type || 'Consultation'}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-3">
                                                <Link
                                                    to={`/medecin/nouvelle-consultation?rdv_id=${rdv.id}&patient_id=${rdv.patient_id}`}
                                                    className="h-12 px-6 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                                                >
                                                    Consulter
                                                    <span className="material-symbols-outlined text-[18px]">stethoscope</span>
                                                </Link>
                                                <button className="size-12 rounded-2xl bg-white dark:bg-slate-800 text-slate-400 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center hover:text-primary transition-all">
                                                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default AgendaMedecin;
