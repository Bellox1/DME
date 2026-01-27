import api from '../api';

const authService = {
    // Connexion
    async login(credentials) {
        // credentials: { login, mot_de_passe }
        const response = await api.post('/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        if (response.data.premiere_connexion !== undefined) {
            localStorage.setItem('user-first-login', response.data.premiere_connexion);
        }
        return response.data;
    },

    // Alias for login used in some components
    async loginByPhone(phone, password) {
        return this.login({ login: phone, mot_de_passe: password });
    },

    // Inscription (Parent / Patient Autonome)
    async register(data) {
        const response = await api.post('/register', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            // Force first login flag for new registrations
            localStorage.setItem('user-first-login', '1');
        }
        return response.data;
    },

    // Mise à jour mot de passe
    async updatePassword(data) {
        const response = await api.post('/update-password', data);
        if (response.data.premiere_connexion === false) {
            localStorage.setItem('user-first-login', 'false');
        }
        return response.data;
    },

    // Check account status
    async checkActivation(login) {
        const response = await api.post('/check-activation', { login });
        return response.data;
    },

    // Demande de réinitialisation de mot de passe
    async forgotPassword(phone) {
        const response = await api.post('/forgot-password', { login: phone });
        return response.data;
    },

    // Réinitialisation effective du mot de passe
    async resetPassword(data) {
        // data: { login, nouveau_mot_de_passe, nouveau_mot_de_passe_confirmation }
        const response = await api.post('/reset-password', data);
        return response.data;
    },

    // Récupérer l'utilisateur courant
    async getUser() {
        const response = await api.get('/user');
        return response.data;
    },

    // Déconnexion
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('user-first-login');
    }
};

export default authService;
