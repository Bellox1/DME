import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class DemandeRdvService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Créer une nouvelle demande de rendez-vous
  async createDemande(demandeData) {
    try {
      const response = await this.api.post('/demande-rdv', demandeData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
      throw error;
    }
  }

  // Valider une demande de rendez-vous (pour l'accueil)
  async validerDemande(id) {
    try {
      const response = await this.api.patch(`/demande-rdv/${id}/valider`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la validation de la demande ${id}:`, error);
      throw error;
    }
  }

  // Récupérer toutes les demandes (à implémenter dans le backend)
  async getAllDemandes() {
    try {
      const response = await this.api.get('/demande-rdv');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      throw error;
    }
  }

  // Récupérer une demande spécifique
  async getDemandeById(id) {
    try {
      const response = await this.api.get(`/demande-rdv/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la demande ${id}:`, error);
      throw error;
    }
  }
}

export default new DemandeRdvService();
