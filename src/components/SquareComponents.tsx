import React from "react";

interface SquareProps {
    value: string | null;
    onClick: () => void;
    isWinnerSquare: boolean; // Ajoutez cette propriété
    isDrawSquare: boolean;
}

function SquareComponent({ value, onClick, isWinnerSquare, isDrawSquare }: SquareProps) {
    return (
        <button
            className={`w-24 h-24 border border-gray-500 text-4xl text-black text-center ${isWinnerSquare ? 'animate-won-square' : ''
                } ${isDrawSquare ? 'animate-draw-square' : ''}`}
            onClick={onClick}
        >
            {value}
        </button>
    );
}

export default SquareComponent;
