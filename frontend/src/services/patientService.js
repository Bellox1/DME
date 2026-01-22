import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class PatientService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Récupérer tous les patients
  async getAllPatients() {
    try {
      const response = await this.api.get('/patients');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des patients:', error);
      throw error;
    }
  }

  // Récupérer un patient par son ID
  async getPatientById(id) {
    try {
      const response = await this.api.get(`/patients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du patient ${id}:`, error);
      throw error;
    }
  }

  // Créer un nouveau patient
  async createPatient(patientData) {
    try {
      const response = await this.api.post('/patients', patientData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du patient:', error);
      throw error;
    }
  }

  // Mettre à jour un patient
  async updatePatient(id, patientData) {
    try {
      const response = await this.api.put(`/patients/${id}`, patientData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du patient ${id}:`, error);
      throw error;
    }
  }

  // Supprimer un patient
  async deletePatient(id) {
    try {
      await this.api.delete(`/patients/${id}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du patient ${id}:`, error);
      throw error;
    }
  }

  // Récupérer les consultations d'un patient
  async getPatientConsultations(patientId) {
    try {
      const response = await this.api.get(`/patients/${patientId}/consultations`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des consultations du patient ${patientId}:`, error);
      throw error;
    }
  }

  // Récupérer les rendez-vous d'un patient
  async getPatientRdvs(patientId) {
    try {
      const response = await this.api.get(`/patients/${patientId}/rdvs`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des rendez-vous du patient ${patientId}:`, error);
      throw error;
    }
  }
}

export default new PatientService();
