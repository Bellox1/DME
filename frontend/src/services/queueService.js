import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class QueueService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Récupérer la file d'attente
  async getQueue() {
    try {
      const response = await this.api.get('/queue');
      // Gérer le format de réponse Laravel {success: true, data: [...]}
      return Array.isArray(response.data) ? response.data : (response.data.data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération de la file d\'attente:', error);
      throw error;
    }
  }

  // Mettre à jour le statut d'un RDV dans la file d'attente
  async updateRdvStatus(id, status) {
    try {
      const response = await this.api.patch(`/rdvs/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut du RDV ${id}:`, error);
      throw error;
    }
  }

  // Ajouter un patient à la file d'attente
  async addToQueue(patientData) {
    try {
      const response = await this.api.post('/queue', patientData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout à la file d\'attente:', error);
      throw error;
    }
  }

  // Retirer un patient de la file d'attente
  async removeFromQueue(id) {
    try {
      await this.api.delete(`/queue/${id}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors du retrait de la file d'attente ${id}:`, error);
      throw error;
    }
  }
}

export default new QueueService();
