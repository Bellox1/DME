import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class PrescriptionService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Créer une prescription pour une consultation
  async createPrescription(consultationId, prescriptionData) {
    try {
      const response = await this.api.post(`/consultations/${consultationId}/prescriptions`, prescriptionData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la prescription:', error);
      throw error;
    }
  }

  // Récupérer les prescriptions d'une consultation
  async getConsultationPrescriptions(consultationId) {
    try {
      const response = await this.api.get(`/consultations/${consultationId}/prescriptions`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des prescriptions de la consultation ${consultationId}:`, error);
      throw error;
    }
  }

  // Supprimer une prescription
  async deletePrescription(id) {
    try {
      await this.api.delete(`/prescriptions/${id}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la prescription ${id}:`, error);
      throw error;
    }
  }

  // Mettre à jour une prescription
  async updatePrescription(id, prescriptionData) {
    try {
      const response = await this.api.put(`/prescriptions/${id}`, prescriptionData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la prescription ${id}:`, error);
      throw error;
    }
  }

  // Récupérer une prescription par son ID
  async getPrescriptionById(id) {
    try {
      const response = await this.api.get(`/prescriptions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la prescription ${id}:`, error);
      throw error;
    }
  }
}

export default new PrescriptionService();
