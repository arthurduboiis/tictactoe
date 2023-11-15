import React from 'react';

interface RegisterProps {
    onClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ onClose }) => {
    // Logique d'inscription à implémenter, avec un formulaire ou autre niv front

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-md">
                {/* Mettre un formu d'inscription, à voir */}
                <h2 className="text-2xl font-bold mb-4">S'inscrire</h2>
                {/* ... */}
                <button onClick={onClose}>Fermer</button>
            </div>
        </div>
    );
};

export default Register;