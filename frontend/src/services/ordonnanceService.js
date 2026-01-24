import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class OrdonnanceService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Générer un PDF d'ordonnance pour une consultation
  async generateOrdonnancePdf(consultationId) {
    try {
      const response = await this.api.get(`/consultations/${consultationId}/pdf`, {
        responseType: 'blob'
      });
      
      // Créer un URL pour le blob et télécharger le fichier
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ordonnance_consultation_${consultationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la génération du PDF de l'ordonnance pour la consultation ${consultationId}:`, error);
      throw error;
    }
  }

  // Prévisualiser l'ordonnance (retourne l'URL du PDF)
  async previewOrdonnance(consultationId) {
    try {
      const response = await this.api.get(`/consultations/${consultationId}/pdf`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      return url;
    } catch (error) {
      console.error(`Erreur lors de la prévisualisation de l'ordonnance pour la consultation ${consultationId}:`, error);
      throw error;
    }
  }

  // Envoyer l'ordonnance par email
  async emailOrdonnance(consultationId, emailData) {
    try {
      const response = await this.api.post(`/consultations/${consultationId}/email`, emailData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'envoi de l'ordonnance par email pour la consultation ${consultationId}:`, error);
      throw error;
    }
  }

  // Récupérer la liste des ordonnances d'un patient
  async getPatientOrdonnances(patientId) {
    try {
      const response = await this.api.get(`/patients/${patientId}/ordonnances`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des ordonnances du patient ${patientId}:`, error);
      throw error;
    }
  }
}

export default new OrdonnanceService();
