import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class EnfantService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Créer un nouvel enfant
  async createEnfant(enfantData) {
    try {
      const response = await this.api.post('/enfants', enfantData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'enfant:', error);
      throw error;
    }
  }

  // Récupérer tous les enfants d'un parent
  async getParentEnfants(parentId) {
    try {
      const response = await this.api.get(`/utilisateurs/${parentId}/enfants`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des enfants du parent ${parentId}:`, error);
      throw error;
    }
  }

  // Récupérer un enfant par son ID
  async getEnfantById(id) {
    try {
      const response = await this.api.get(`/enfants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'enfant ${id}:`, error);
      throw error;
    }
  }

  // Mettre à jour un enfant
  async updateEnfant(id, enfantData) {
    try {
      const response = await this.api.put(`/enfants/${id}`, enfantData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'enfant ${id}:`, error);
      throw error;
    }
  }

  // Supprimer un enfant
  async deleteEnfant(id) {
    try {
      await this.api.delete(`/enfants/${id}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'enfant ${id}:`, error);
      throw error;
    }
  }

  // Récupérer les informations médicales d'un enfant
  async getEnfantMedicalInfo(id) {
    try {
      const response = await this.api.get(`/enfants/${id}/medical`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des infos médicales de l'enfant ${id}:`, error);
      throw error;
    }
  }
}

export default new EnfantService();
