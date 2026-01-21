import React from 'react';

const Logo = ({ size = 'md', showText = true }) => {
    const sizes = {
        sm: { icon: 'size-7', iconSym: 'text-lg', text: 'text-base' },
        md: { icon: 'size-9', iconSym: 'text-xl', text: 'text-lg' },
        lg: { icon: 'size-10', iconSym: 'text-2xl', text: 'text-xl' },
    };

    const currentSize = sizes[size] || sizes.md;

    return (
        <div className="flex gap-3 items-center">
            <div className={`bg-primary rounded-full ${currentSize.icon} flex items-center justify-center text-white shadow-sm transition-all duration-300`}>
                <span className={`material-symbols-outlined ${currentSize.iconSym}`}>health_and_safety</span>
            </div>
            {showText && (
                <div className="flex flex-col">
                    <h1 className={`${currentSize.text} text-titles dark:text-white font-bold leading-none tracking-tight transition-colors duration-[800ms]`}>
                        DME
                    </h1>
                </div>
            )}
        </div>
    );
};

export default Logo;
