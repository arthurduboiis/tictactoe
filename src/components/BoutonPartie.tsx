import React from "react";
import BoardComponent from "./BoardComponents";

interface BoutonPartieProps {
    gameMode: string;
}

function BoutonPartie({ gameMode }: BoutonPartieProps) {
    const squares = Array(9).fill(null);
    const isGameWon = false;
    const isGameDraw = false;

    const handleClick = (i: number) => {
        // Logique à mettre en place pour gérer le clic sur une case du morpion (voir le composant HomePage).
    };

    return (
        <div>
            {/* Code pour le composant BoutonPartie */}
            <BoardComponent
                Squares={squares}
                onClick={handleClick}
                isGameWon={isGameWon}
                isGameDraw={isGameDraw}
                gameMode={gameMode}
            />
        </div>
    );
}

export default BoutonPartie;
