import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class UtilisateurService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Récupérer tous les utilisateurs
  async getAllUtilisateurs() {
    try {
      const response = await this.api.get('/utilisateurs');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  }

  // Récupérer un utilisateur par son ID
  async getUtilisateurById(id) {
    try {
      const response = await this.api.get(`/utilisateurs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
      throw error;
    }
  }

  // Créer un nouvel utilisateur
  async createUtilisateur(utilisateurData) {
    try {
      const response = await this.api.post('/utilisateurs', utilisateurData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  }

  // Mettre à jour un utilisateur
  async updateUtilisateur(id, utilisateurData) {
    try {
      const response = await this.api.put(`/utilisateurs/${id}`, utilisateurData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, error);
      throw error;
    }
  }

  // Supprimer un utilisateur
  async deleteUtilisateur(id) {
    try {
      await this.api.delete(`/utilisateurs/${id}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, error);
      throw error;
    }
  }

  // Authentification par téléphone
  async loginByPhone(phone, password) {
    try {
      const response = await this.api.post('/auth/login', {
        tel: phone,
        mot_de_passe: password
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'authentification:', error);
      throw error;
    }
  }

  // Rafraîchir le token
  async refreshToken(refreshToken) {
    try {
      const response = await this.api.post('/auth/refresh', {
        refresh_token: refreshToken
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      throw error;
    }
  }

  // Récupérer les enfants d'un utilisateur
  async getUtilisateurEnfants(utilisateurId) {
    try {
      const response = await this.api.get(`/utilisateurs/${utilisateurId}/enfants`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des enfants de l'utilisateur ${utilisateurId}:`, error);
      throw error;
    }
  }

  // Récupérer le profil patient d'un utilisateur
  async getUtilisateurPatient(utilisateurId) {
    try {
      const response = await this.api.get(`/utilisateurs/${utilisateurId}/patient`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du profil patient de l'utilisateur ${utilisateurId}:`, error);
      throw error;
    }
  }

  // Récupérer les demandes d'un utilisateur
  async getUtilisateurDemandes(utilisateurId) {
    try {
      const response = await this.api.get(`/utilisateurs/${utilisateurId}/demandes`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des demandes de l'utilisateur ${utilisateurId}:`, error);
      throw error;
    }
  }
}

export default new UtilisateurService();
