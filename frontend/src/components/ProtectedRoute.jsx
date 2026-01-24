import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import FirstLoginModal from './FirstLoginModal';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const location = useLocation();

    const [showFirstLogin, setShowFirstLogin] = useState(false);

    useEffect(() => {
        const isFirstLogin = localStorage.getItem('user-first-login') !== 'false';
        if (userString && token && isFirstLogin) {
            setShowFirstLogin(true);
        }
    }, [userString, token]);

    if (!userString || !token) {
        // Not logged in
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const user = JSON.parse(userString);
    const isFirstLogin = localStorage.getItem('user-first-login') !== 'false';

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Role not authorized -> Redirect to their specific dashboard instead of login
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'accueil') return <Navigate to="/accueil" replace />;
        if (user.role === 'medecin') return <Navigate to="/medecin" replace />;
        if (user.role === 'patient') return <Navigate to="/patient" replace />;
        return <Navigate to="/login" replace />;
    }

    const handleFirstLoginComplete = () => {
        localStorage.setItem('user-first-login', 'false');
        setShowFirstLogin(false);
    };

    return (
        <>
            {showFirstLogin && (
                <FirstLoginModal
                    userPhone={user.tel || ""}
                    onComplete={handleFirstLoginComplete}
                />
            )}
            {children}
        </>
    );
};

export default ProtectedRoute;
