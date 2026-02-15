import React from 'react';
import useSousCompte from '../../hooks/useSousCompte';
import sousCompteService from '../../services/patient/sousCompteService';

/**
 * Composant de sélection de profil pour le système de sous-compte
 * @param {Object} props - Propriétés du composant
 * @param {Function} props.onProfilChange - Callback lors du changement de profil
 * @param {boolean} props.showReset - Afficher le bouton de réinitialisation
 * @param {string} props.className - Classes CSS supplémentaires
 */
const ProfilSelector = ({ onProfilChange, showReset = true, className = '' }) => {
    const {
        profils,
        profilActuel,
        loading,
        error,
        changerProfil,
        resetToTitulaire,
        aPlusieursProfils,
        getInfosProfil
    } = useSousCompte();

    const handleProfilChange = async (nouveauProfil) => {
        await changerProfil(nouveauProfil);
        if (onProfilChange) {
            onProfilChange(nouveauProfil);
        }
    };

    const handleReset = async () => {
        await resetToTitulaire();
        if (onProfilChange) {
            onProfilChange(null);
        }
    };

    if (loading) {
        return (
            <div className={`animate-pulse ${className}`}>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg ${className}`}>
                <span className="text-sm">Erreur: {error}</span>
            </div>
        );
    }

    if (!aPlusieursProfils) {
        // Afficher uniquement le profil actuel si pas de sous-comptes
        const infos = getInfosProfil();
        return (
            <div className={`bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg ${className}`}>
                <div className="flex items-center space-x-2">
                    <span className="text-lg">{infos?.icone || '👤'}</span>
                    <span className="text-sm font-medium text-gray-700">
                        {infos?.nom_affichage || 'Moi'}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-2 ${className}`}>
            {/* Sélecteur de profil */}
            <div className="relative">
                <select
                    value={profilActuel?.id || ''}
                    onChange={(e) => {
                        const profil = profils.find(p => p.id === e.target.value);
                        if (profil) {
                            handleProfilChange(profil);
                        }
                    }}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                    {profils.map((profil) => {
                        const infos = sousCompteService.getInfosProfil(profil);
                        return (
                            <option key={profil.id} value={profil.id}>
                                {infos.icone} {infos.nom_affichage}
                            </option>
                        );
                    })}
                </select>
                
                {/* Icône de flèche */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Bouton de réinitialisation */}
            {showReset && !profilActuel?.type === 'Titulaire' && (
                <button
                    onClick={handleReset}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                    title="Revenir au profil principal"
                >
                    ← Revenir à mon profil
                </button>
            )}

            {/* Indicateur du profil actuel */}
            {profilActuel && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {profilActuel.type}
                    </span>
                    {profilActuel.type === 'Enfant' && (
                        <span className="text-xs">
                            En cours de consultation pour {profilActuel.nom_affichage}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfilSelector;
