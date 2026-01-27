import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import FirstLoginModal from './FirstLoginModal';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const location = useLocation();

    const [showFirstLogin, setShowFirstLogin] = useState(false);

    // Modifié : Redirection vers la page dédiée FirstLogin au lieu de la modale
    useEffect(() => {
        // La valeur stockée peut être "1", 1, "true", ou true. On normalise.
        const storedVal = localStorage.getItem('user-first-login');
        const isFirstLogin = storedVal === '1' || storedVal === 1 || storedVal === 'true' || storedVal === true;

        if (userString && token && isFirstLogin) {
            // On récupère le numéro (tel ou whatsapp) pour construire l'URL
            // On parse userString ici car 'user' ligne 24 n'est pas accessible dans le useEffect sans dépendance
            const u = JSON.parse(userString);
            const login = u.whatsapp || u.tel || u.email; // Fallback

            if (login) {
                // Redirection forcée vers la page d'activation
                window.location.href = `/first-login?connexion=${encodeURIComponent(login)}`;
            }
        }
    }, [userString, token]);

    if (!userString || !token) {
        // Not logged in
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const user = JSON.parse(userString);
    // Supprimé : const isFirstLogin ... (déjà géré par le useEffect)

    // Logique de rôle maintenue
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'accueil') return <Navigate to="/accueil" replace />;
        if (user.role === 'medecin') return <Navigate to="/medecin" replace />;
        if (user.role === 'patient') return <Navigate to="/patient" replace />;
        return <Navigate to="/login" replace />;
    }

    // Plus de modale
    return (
        <>
            {children}
        </>
    );
};

export default ProtectedRoute;
