import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true
});

// Intercepteur pour ajouter le token de session Bearer
api.interceptors.request.use((config) => {
    // On essaie de récupérer le token (soit auth_token soit token selon la version)
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
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
