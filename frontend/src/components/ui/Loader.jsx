import React from 'react';

const Loader = ({ size = 'medium', text = 'Chargement...' }) => {
    const sizeClasses = {
        small: 'w-6 h-6',
        medium: 'w-8 h-8',
        large: 'w-12 h-12'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-slate-200 border-t-primary`}></div>
            {text && (
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{text}</p>
            )}
        </div>
    );
};

export default Loader;
