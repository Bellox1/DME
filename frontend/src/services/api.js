import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Ajuster selon le port de Laravel
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Intercepteur pour ajouter le token de session
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Intercepteur pour gérer les erreurs globales (ex: 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optionnel : Rediriger vers login ou vider le storage
            // localStorage.removeItem('auth_token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
