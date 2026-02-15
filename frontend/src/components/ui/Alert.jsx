import React from 'react';

const Alert = ({ type = 'info', message, onClose, className = '' }) => {
    const typeStyles = {
        success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
        error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
        info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200'
    };

    const iconStyles = {
        success: 'text-green-500',
        error: 'text-red-500',
        warning: 'text-yellow-500',
        info: 'text-blue-500'
    };

    const icons = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info'
    };

    return (
        <div className={`flex items-center justify-between p-4 rounded-xl border ${typeStyles[type]} ${className}`}>
            <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-xl ${iconStyles[type]}`}>
                    {icons[type]}
                </span>
                <p className="text-sm font-medium">{message}</p>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className={`material-symbols-outlined text-lg ${iconStyles[type]} hover:opacity-70 transition-opacity`}
                >
                    close
                </button>
            )}
        </div>
    );
};

export default Alert;
