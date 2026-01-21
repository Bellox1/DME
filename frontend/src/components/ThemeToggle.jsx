import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className={`flex items-center ${className}`}>
            <button
                onClick={toggleTheme}
                className="relative inline-flex h-9 w-20 md:h-11 md:w-28 items-center rounded-full cursor-pointer overflow-hidden bg-slate-200 dark:bg-[#1c2229] border-2 border-slate-300 dark:border-[#2d363f] shadow-sm transition-colors duration-300"
                title={isDark ? 'Mode clair' : 'Mode sombre'}
            >
                {/* Icônes de fond (Soleil et Lune) */}
                <div className="absolute inset-0 flex items-center justify-around px-2 md:px-3 pointer-events-none">
                    {/* Soleil (gauche) */}
                    <div className={`flex items-center justify-center transition-all duration-300 ${isDark ? 'opacity-30 scale-75' : 'opacity-100 scale-100'
                        }`}>
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-white dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                    </div>

                    {/* Lune (droite) */}
                    <div className={`flex items-center justify-center transition-all duration-300 ${isDark ? 'opacity-100 scale-100' : 'opacity-30 scale-75'
                        }`}>
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-400 dark:text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    </div>
                </div>

                {/* Le bouton coulissant (Knob) */}
                <div
                    className={`${isDark ? 'translate-x-[44px] md:translate-x-[64px]' : 'translate-x-1'
                        } inline-block h-7 w-7 md:h-9 md:w-9 transform rounded-full shadow-lg transition-all duration-500 ease-in-out relative flex items-center justify-center bg-white`}
                    style={{
                        zIndex: 20
                    }}
                >
                    {isDark ? (
                        <svg className="w-3 h-3 md:w-4 md:h-4 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    ) : (
                        <svg className="w-3 h-3 md:w-4 md:h-4 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
            </button>
        </div>
    );
};

export default ThemeToggle;
