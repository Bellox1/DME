import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ConsultationService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Créer une nouvelle consultation
  async createConsultation(consultationData) {
    try {
      const response = await this.api.post('/consultations', consultationData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la consultation:', error);
      throw error;
    }
  }

  // Récupérer une consultation par son ID
  async getConsultationById(id) {
    try {
      const response = await this.api.get(`/consultations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la consultation ${id}:`, error);
      throw error;
    }
  }

  // Mettre à jour une consultation
  async updateConsultation(id, consultationData) {
    try {
      const response = await this.api.put(`/consultations/${id}`, consultationData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la consultation ${id}:`, error);
      throw error;
    }
  }

  // Récupérer toutes les consultations d'un patient
  async getPatientConsultations(patientId) {
    try {
      const response = await this.api.get(`/patients/${patientId}/consultations`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des consultations du patient ${patientId}:`, error);
      throw error;
    }
  }

  // Terminer une consultation
  async endConsultation(id, endDateData) {
    try {
      const response = await this.api.patch(`/consultations/${id}/end`, endDateData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la fin de la consultation ${id}:`, error);
      throw error;
    }
  }
}

export default new ConsultationService();
