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

  // Récupérer tous les utilisateurs (via les patients)
  async getAllUtilisateurs() {
    try {
      const response = await this.api.get('/patients');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  }

  // Créer un nouvel utilisateur (via register)
  async createUtilisateur(utilisateurData) {
    try {
      const response = await this.api.post('/register', utilisateurData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
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
}

export default new UtilisateurService();
