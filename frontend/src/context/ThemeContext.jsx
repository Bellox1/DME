import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark';
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => {
        const root = document.documentElement;
        const nextColor = isDark ? '#f6f7f7' : '#15191d';
        root.style.setProperty('--overlay-color', nextColor);

        // 1. Déclencher l'expansion circulaire immédiatement
        root.classList.remove('theme-transition-fadeout');
        root.classList.add('theme-transition-active');

        // 2. Changer le thème plus tôt (300ms au lieu de 600ms) pour que ce soit réactif
        setTimeout(() => {
            setIsDark(prev => !prev);
        }, 300);

        // 3. Après l'expansion (600ms), lancer le fondu de sortie
        setTimeout(() => {
            root.classList.replace('theme-transition-active', 'theme-transition-fadeout');
        }, 700);

        // 4. Nettoyage
        setTimeout(() => {
            root.classList.remove('theme-transition-fadeout');
        }, 1200);
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
            <div className="theme-fill-overlay" />
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
