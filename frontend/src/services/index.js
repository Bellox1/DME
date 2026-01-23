// Export des services pour une utilisation centralisée
import patientService from './patientService.js';
import utilisateurService from './utilisateurService.js';
import demandeRdvService from './demandeRdvService.js';

export {
  patientService,
  utilisateurService,
  demandeRdvService
};

// Export par défaut pour un accès facile
export default {
  patientService,
  utilisateurService,
  demandeRdvService
};
