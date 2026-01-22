// Export des services pour une utilisation centralisée
import patientService from './patientService.js';
import utilisateurService from './utilisateurService.js';

export {
  patientService,
  utilisateurService
};

// Export par défaut pour un accès facile
export default {
  patientService,
  utilisateurService
};
