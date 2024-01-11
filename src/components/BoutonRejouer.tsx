import React from "react";

type BoutonRejouerProps = {
    onRejouer: () => void;
};

function BoutonRejouer({ onRejouer }: BoutonRejouerProps) {
    return (
        <button onClick={onRejouer} className="bg-blue-500 tex-white rounded-md px-3 py-2 mt-4">
            Rejouer
        </button>
    );
};

export default BoutonRejouer;
