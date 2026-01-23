import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class MedicalHistoryService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Récupérer l'historique médical d'un patient
  async getPatientHistory(patientId) {
    try {
      const response = await this.api.get(`/patients/${patientId}/history`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'historique du patient ${patientId}:`, error);
      throw error;
    }
  }

  // Ajouter un élément à l'historique médical
  async addToHistory(patientId, historyData) {
    try {
      const response = await this.api.post(`/patients/${patientId}/history`, historyData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'ajout à l'historique du patient ${patientId}:`, error);
      throw error;
    }
  }

  // Mettre à jour un élément de l'historique
  async updateHistoryItem(patientId, historyItemId, historyData) {
    try {
      const response = await this.api.put(`/patients/${patientId}/history/${historyItemId}`, historyData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'historique ${historyItemId} du patient ${patientId}:`, error);
      throw error;
    }
  }

  // Supprimer un élément de l'historique
  async deleteHistoryItem(patientId, historyItemId) {
    try {
      await this.api.delete(`/patients/${patientId}/history/${historyItemId}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'historique ${historyItemId} du patient ${patientId}:`, error);
      throw error;
    }
  }

  // Récupérer les antécédents spécifiques
  async getMedicalAntecedents(patientId) {
    try {
      const response = await this.api.get(`/patients/${patientId}/antecedents`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des antécédents du patient ${patientId}:`, error);
      throw error;
    }
  }

  // Récupérer les allergies
  async getPatientAllergies(patientId) {
    try {
      const response = await this.api.get(`/patients/${patientId}/allergies`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des allergies du patient ${patientId}:`, error);
      throw error;
    }
  }
}

export default new MedicalHistoryService();
