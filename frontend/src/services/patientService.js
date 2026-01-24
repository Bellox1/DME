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

  // Récupérer un patient par son ID (non disponible pour l'instant)
  async getPatientById(id) {
    try {
      // Cette route n'existe pas encore dans le backend
      console.warn(`Route /patients/${id} non implémentée dans le backend`);
      return null;
    } catch (error) {
      console.error(`Erreur lors de la récupération du patient ${id}:`, error);
      throw error;
    }
  }

  // Créer un nouveau patient (non disponible pour l'instant)
  async createPatient() {
    try {
      // Cette route n'existe pas encore dans le backend
      console.warn('Route /patients POST non implémentée dans le backend');
      throw new Error('Création de patient non disponible');
    } catch (error) {
      console.error('Erreur lors de la création du patient:', error);
      throw error;
    }
  }

  // Mettre à jour un patient (non disponible pour l'instant)
  async updatePatient(id) {
    try {
      // Cette route n'existe pas encore dans le backend
      console.warn(`Route /patients/${id} PUT non implémentée dans le backend`);
      throw new Error('Mise à jour de patient non disponible');
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du patient ${id}:`, error);
      throw error;
    }
  }

  // Supprimer un patient (non disponible pour l'instant)
  async deletePatient(id) {
    try {
      // Cette route n'existe pas encore dans le backend
      console.warn(`Route /patients/${id} DELETE non implémentée dans le backend`);
      throw new Error('Suppression de patient non disponible');
    } catch (error) {
      console.error(`Erreur lors de la suppression du patient ${id}:`, error);
      throw error;
    }
  }

  // Récupérer les consultations d'un patient (non disponible pour l'instant)
  async getPatientConsultations(id) {
    try {
      // Cette route n'existe pas encore dans le backend
      console.warn(`Route /patients/${id}/consultations non implémentée dans le backend`);
      return [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des consultations du patient ${id}:`, error);
      throw error;
    }
  }

  // Récupérer les RDV d'un patient (non disponible pour l'instant)
  async getPatientRdvs(id) {
    try {
      // Cette route n'existe pas encore dans le backend
      console.warn(`Route /patients/${id}/rdvs non implémentée dans le backend`);
      return [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des RDV du patient ${id}:`, error);
      throw error;
    }
  }
}

export default new PatientService();
