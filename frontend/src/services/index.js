// Export des services pour une utilisation centralisée
import patientService from './patientService.js';
import utilisateurService from './utilisateurService.js';
import demandeRdvService from './demandeRdvService.js';
import queueService from './queueService.js';
import consultationService from './consultationService.js';
import prescriptionService from './prescriptionService.js';
import medicalHistoryService from './medicalHistoryService.js';
import ordonnanceService from './ordonnanceService.js';
import enfantService from './enfantService.js';
import rdvService from './rdvService.js';

export {
  patientService,
  utilisateurService,
  demandeRdvService,
  queueService,
  consultationService,
  prescriptionService,
  medicalHistoryService,
  ordonnanceService,
  enfantService,
  rdvService
};

// Export par défaut pour un accès facile
export default {
  patientService,
  utilisateurService,
  demandeRdvService,
  queueService,
  consultationService,
  prescriptionService,
  medicalHistoryService,
  ordonnanceService,
  enfantService,
  rdvService
};
