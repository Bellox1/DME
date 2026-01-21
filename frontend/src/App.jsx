import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Auth
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import AideConnexion from './pages/auth/AideConnexion';

// Patient
import PatientDashboard from './pages/patient/Dashboard';
import PatientProfil from './pages/patient/Profil';
import PatientConsultations from './pages/patient/Consultations';
import PatientOrdonnances from './pages/patient/Ordonnances';
import PatientDossier from './pages/patient/Dossier';
import PatientResultats from './pages/patient/Resultats';
import PatientNotifications from './pages/patient/Notifications';
import PatientAide from './pages/patient/Aide';

// Accueil
import ReceptionDashboard from './pages/accueil/Dashboard';
import ReceptionEnregistrement from './pages/accueil/Enregistrement';
import ReceptionPatients from './pages/accueil/Patients';
import ReceptionRendezVous from './pages/accueil/RendezVous';
import ReceptionFileAttente from './pages/accueil/FileAttente';
import ReceptionCaisse from './pages/accueil/Caisse';
import ReceptionStats from './pages/accueil/Stats';
import ReceptionProfil from './pages/accueil/Profil';
import ReceptionNotifications from './pages/accueil/Notifications';
import ReceptionAide from './pages/accueil/Aide';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminRoles from './pages/admin/Roles';
import AdminUtilisateurs from './pages/admin/Utilisateurs';
import AdminInscription from './pages/admin/Inscription';
import AdminProfil from './pages/admin/Profil';
import AdminLogs from './pages/admin/Logs';
import AdminNotifications from './pages/admin/Notifications';
import AdminStats from './pages/admin/Stats';

// Medecin
import DoctorDashboard from './pages/medecin/Dashboard';
import DoctorAgenda from './pages/medecin/Agenda';
import DoctorPatients from './pages/medecin/Patients';
import DoctorConsultations from './pages/medecin/Consultations';
import DoctorOrdonnances from './pages/medecin/Ordonnances';
import DoctorResultats from './pages/medecin/Resultats';
import DoctorStats from './pages/medecin/Stats';
import DoctorProfil from './pages/medecin/Profil';
import DoctorNotifications from './pages/medecin/Notifications';
import DoctorAide from './pages/medecin/Aide';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* ==================== AUTHENTIFICATION ==================== */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/aide-connexion" element={<AideConnexion />} />

          {/* ==================== PATIENT ==================== */}
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/patient/profil" element={<PatientProfil />} />
          <Route path="/patient/consultations" element={<PatientConsultations />} />
          <Route path="/patient/ordonnances" element={<PatientOrdonnances />} />
          <Route path="/patient/dossier" element={<PatientDossier />} />
          <Route path="/patient/resultats" element={<PatientResultats />} />
          <Route path="/patient/notifications" element={<PatientNotifications />} />
          <Route path="/patient/aide-patient" element={<PatientAide />} />
          <Route path="/patient/securite" element={<PatientProfil />} />

          {/* ==================== ACCUEIL ==================== */}
          <Route path="/accueil" element={<ReceptionDashboard />} />
          <Route path="/accueil/enregistrement" element={<ReceptionEnregistrement />} />
          <Route path="/accueil/patients" element={<ReceptionPatients />} />
          <Route path="/accueil/rdv" element={<ReceptionRendezVous />} />
          <Route path="/accueil/file-attente" element={<ReceptionFileAttente />} />
          <Route path="/accueil/caisse" element={<ReceptionCaisse />} />
          <Route path="/accueil/stats" element={<ReceptionStats />} />
          <Route path="/accueil/profil" element={<ReceptionProfil />} />
          <Route path="/accueil/notifications" element={<ReceptionNotifications />} />
          <Route path="/accueil/aide" element={<ReceptionAide />} />

          {/* ==================== ADMIN ==================== */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/utilisateurs" element={<AdminUtilisateurs />} />
          <Route path="/admin/inscription" element={<AdminInscription />} />
          <Route path="/admin/parametres" element={<AdminRoles />} />
          <Route path="/admin/profil" element={<AdminProfil />} />
          <Route path="/admin/logs" element={<AdminLogs />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/stats" element={<AdminStats />} />
          <Route path="/admin/parametres" element={<AdminRoles />} />

          {/* ==================== MEDECIN ==================== */}
          <Route path="/medecin" element={<DoctorDashboard />} />
          <Route path="/medecin/agenda" element={<DoctorAgenda />} />
          <Route path="/medecin/patients" element={<DoctorPatients />} />
          <Route path="/medecin/consultations" element={<DoctorConsultations />} />
          <Route path="/medecin/ordonnances" element={<DoctorOrdonnances />} />
          <Route path="/medecin/resultats" element={<DoctorResultats />} />
          <Route path="/medecin/stats" element={<DoctorStats />} />
          <Route path="/medecin/profil" element={<DoctorProfil />} />
          <Route path="/medecin/notifications" element={<DoctorNotifications />} />
          <Route path="/medecin/aide-medecin" element={<DoctorAide />} />

          {/* ==================== REDIRECTIONS ==================== */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
