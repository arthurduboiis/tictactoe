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
    };

    return (
        <div>
            { }
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