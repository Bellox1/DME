import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class RdvService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Créer un nouveau RDV
  async createRdv(rdvData) {
    try {
      const response = await this.api.post('/rdvs', rdvData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du RDV:', error);
      throw error;
    }
  }

  // Récupérer tous les RDV
  async getAllRdvs() {
    try {
      const response = await this.api.get('/rdvs');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des RDV:', error);
      throw error;
    }
  }

  // Récupérer un RDV par son ID
  async getRdvById(id) {
    try {
      const response = await this.api.get(`/rdvs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du RDV ${id}:`, error);
      throw error;
    }
  }

  // Mettre à jour un RDV
  async updateRdv(id, rdvData) {
    try {
      const response = await this.api.put(`/rdvs/${id}`, rdvData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du RDV ${id}:`, error);
      throw error;
    }
  }

  // Supprimer un RDV
  async deleteRdv(id) {
    try {
      await this.api.delete(`/rdvs/${id}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du RDV ${id}:`, error);
      throw error;
    }
  }

  // Récupérer les RDV d'un patient
  async getPatientRdvs(patientId) {
    try {
      const response = await this.api.get(`/patients/${patientId}/rdvs`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des RDV du patient ${patientId}:`, error);
      throw error;
    }
  }

  // Récupérer les RDV d'un médecin
  async getMedecinRdvs(medecinId) {
    try {
      const response = await this.api.get(`/medecins/${medecinId}/rdvs`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des RDV du médecin ${medecinId}:`, error);
      throw error;
    }
  }

  // Confirmer un RDV
  async confirmRdv(id) {
    try {
      const response = await this.api.patch(`/rdvs/${id}/confirm`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la confirmation du RDV ${id}:`, error);
      throw error;
    }
  }

  // Annuler un RDV
  async cancelRdv(id, motif) {
    try {
      const response = await this.api.patch(`/rdvs/${id}/cancel`, { motif });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'annulation du RDV ${id}:`, error);
      throw error;
    }
  }
}

export default new RdvService();
