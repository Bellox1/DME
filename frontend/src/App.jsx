import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import AideConnexion from './pages/auth/AideConnexion';
import FirstLogin from './pages/auth/FirstLogin';
import ResetPassword from './pages/auth/ResetPassword';

// Patient
import PatientDashboard from './pages/patient/Dashboard';
import PatientProfil from './pages/patient/Profil';
import PatientConsultations from './pages/patient/Consultations';
import PatientOrdonnances from './pages/patient/Ordonnances';
import PatientDossier from './pages/patient/Dossier';
import PatientActivites from './pages/patient/Activites';
import PatientNotifications from './pages/patient/Notifications';
import PatientAide from './pages/patient/Aide';
import EditPatient from './pages/accueil/EditPatient';

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
import DoctorConsultationForm from './pages/medecin/ConsultationForm';
import DoctorOrdonnances from './pages/medecin/Ordonnances';
import DoctorResultats from './pages/medecin/Resultats';
import DoctorStats from './pages/medecin/Stats';
import DoctorProfil from './pages/medecin/Profil';
import DoctorNotifications from './pages/medecin/Notifications';
import DoctorAide from './pages/medecin/Aide';
import DoctorPatientDossier from './pages/medecin/DossierPatient';
import DoctorConsultationDetail from './pages/medecin/ConsultationDetail';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* ==================== AUTHENTIFICATION ==================== */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/aide-connexion" element={<AideConnexion />} />
          <Route path="/first-login" element={<FirstLogin />} />

          {/* ==================== PATIENT ==================== */}
          <Route path="/patient" element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/profil" element={<ProtectedRoute allowedRoles={['patient']}><PatientProfil /></ProtectedRoute>} />
          <Route path="/patient/consultations" element={<ProtectedRoute allowedRoles={['patient']}><PatientConsultations /></ProtectedRoute>} />
          <Route path="/patient/ordonnances" element={<ProtectedRoute allowedRoles={['patient']}><PatientOrdonnances /></ProtectedRoute>} />
          <Route path="/patient/dossier" element={<ProtectedRoute allowedRoles={['patient']}><PatientDossier /></ProtectedRoute>} />
          <Route path="/patient/dossier/:patientId" element={<ProtectedRoute allowedRoles={['patient']}><PatientDossier /></ProtectedRoute>} />
          <Route path="/patient/activites" element={<ProtectedRoute allowedRoles={['patient']}><PatientActivites /></ProtectedRoute>} />
          <Route path="/patient/notifications" element={<ProtectedRoute allowedRoles={['patient']}><PatientNotifications /></ProtectedRoute>} />
          <Route path="/patient/aide-patient" element={<ProtectedRoute allowedRoles={['patient']}><PatientAide /></ProtectedRoute>} />
          <Route path="/patient/securite" element={<ProtectedRoute allowedRoles={['patient']}><PatientProfil /></ProtectedRoute>} />

          {/* ==================== ACCUEIL ==================== */}
          <Route path="/accueil" element={<ProtectedRoute allowedRoles={['accueil']}><ReceptionDashboard /></ProtectedRoute>} />
          <Route path="/accueil/enregistrement" element={<ProtectedRoute allowedRoles={['accueil']}><ReceptionEnregistrement /></ProtectedRoute>} />
          <Route path="/accueil/patients" element={<ProtectedRoute allowedRoles={['accueil']}><ReceptionPatients /></ProtectedRoute>} />
          <Route path="/accueil/rdv" element={<ProtectedRoute allowedRoles={['accueil']}><ReceptionRendezVous /></ProtectedRoute>} />
          <Route path="/accueil/file-attente" element={<ProtectedRoute allowedRoles={['accueil']}><ReceptionFileAttente /></ProtectedRoute>} />
          <Route path="/accueil/caisse" element={<ProtectedRoute allowedRoles={['accueil']}><ReceptionCaisse /></ProtectedRoute>} />
          <Route path="/accueil/stats" element={<ProtectedRoute allowedRoles={['accueil']}><ReceptionStats /></ProtectedRoute>} />
          <Route path="/accueil/profil" element={<ProtectedRoute allowedRoles={['accueil']}><ReceptionProfil /></ProtectedRoute>} />
          <Route path="/accueil/notifications" element={<ProtectedRoute allowedRoles={['accueil']}><ReceptionNotifications /></ProtectedRoute>} />
          <Route path="/accueil/aide" element={<ProtectedRoute allowedRoles={['accueil']}><ReceptionAide /></ProtectedRoute>} />
          <Route path="/accueil/patients/edit/:id" element={
            <ProtectedRoute allowedRoles={['accueil']}>
              <EditPatient />
            </ProtectedRoute>
          }
          />
          {/* ==================== ADMIN ==================== */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/utilisateurs" element={<ProtectedRoute allowedRoles={['admin']}><AdminUtilisateurs /></ProtectedRoute>} />
          <Route path="/admin/inscription" element={<ProtectedRoute allowedRoles={['admin']}><AdminInscription /></ProtectedRoute>} />
          <Route path="/admin/parametres" element={<ProtectedRoute allowedRoles={['admin']}><AdminRoles /></ProtectedRoute>} />
          <Route path="/admin/profil" element={<ProtectedRoute allowedRoles={['admin']}><AdminProfil /></ProtectedRoute>} />
          <Route path="/admin/logs" element={<ProtectedRoute allowedRoles={['admin']}><AdminLogs /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['admin']}><AdminNotifications /></ProtectedRoute>} />
          <Route path="/admin/stats" element={<ProtectedRoute allowedRoles={['admin']}><AdminStats /></ProtectedRoute>} />
          <Route path="/admin/parametres" element={<AdminRoles />} />

          {/* ==================== MEDECIN ==================== */}
          <Route path="/medecin" element={<ProtectedRoute allowedRoles={['medecin']}><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/medecin/agenda" element={<ProtectedRoute allowedRoles={['medecin']}><DoctorAgenda /></ProtectedRoute>} />
          <Route path="/medecin/patients" element={<ProtectedRoute allowedRoles={['medecin']}><DoctorPatients /></ProtectedRoute>} />
          <Route path="/medecin/consultations" element={<ProtectedRoute allowedRoles={['medecin']}><DoctorConsultations /></ProtectedRoute>} />

          <Route path="/medecin/ordonnances" element={<ProtectedRoute allowedRoles={['medecin']}><DoctorOrdonnances /></ProtectedRoute>} />
          <Route path="/medecin/nouvelle-consultation" element={<ProtectedRoute allowedRoles={['medecin']}><DoctorConsultationForm /></ProtectedRoute>} />
          <Route path="/medecin/resultats" element={<ProtectedRoute allowedRoles={['medecin']}><DoctorResultats /></ProtectedRoute>} />
          <Route path="/medecin/stats" element={<ProtectedRoute allowedRoles={['medecin']}><DoctorStats /></ProtectedRoute>} />
          <Route path="/medecin/profil" element={<ProtectedRoute allowedRoles={['medecin']}><DoctorProfil /></ProtectedRoute>} />
          <Route path="/medecin/notifications" element={<ProtectedRoute allowedRoles={['medecin']}><DoctorNotifications /></ProtectedRoute>} />
          <Route path="/medecin/aide-medecin" element={<ProtectedRoute allowedRoles={['medecin']}><DoctorAide /></ProtectedRoute>} />
          <Route path="/medecin/patient/:patientId" element={<ProtectedRoute allowedRoles={['medecin']}><DoctorPatientDossier /></ProtectedRoute>} />
          <Route path="/medecin/consultations/:id" element={<ProtectedRoute allowedRoles={['medecin']}><DoctorConsultationDetail /></ProtectedRoute>} />

          {/* ==================== REDIRECTIONS ==================== */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
