import React, { useState } from "react";
import BoardComponent from "./BoardComponents";
import BoutonRejouer from "./BoutonRejouer";

function HomePageComponents() {
    const [Squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);

    const handleClick = (i: number) => {
        const newSquares = Squares.slice();
        if (calculateWinner(newSquares) || newSquares[i]) return;
        newSquares[i] = xIsNext ? "X" : "O";
        setSquares(newSquares);
        setXIsNext(!xIsNext);
    }

    const handleRejouer = () => {
        setSquares(Array(9).fill(null));
        setXIsNext(true);
    };


    const winner = calculateWinner(Squares); // Cette variable est à utiliser pour déterminer si le jeu est gagné
    let status;
    if (winner) { // Cette condition sert a montrer le status du jeu
        status = "Winner: " + winner;
    } else if (Squares.every((square) => square !== null)) { // Voir le Squares.every sur la doc
        status = "Egalité";
    } else {
        status = "Joueur: " + (xIsNext ? "X" : "O"); // xIsNext est à utiliser pour déterminer quel joueur doit jouer
    }

    const showRejouerButton = winner || Squares.every((square) => square !== null);


    return (
        <div className="text-center mt-10">
            <div className="text-3xl mb-4">{status}</div>
            <BoardComponent
                Squares={Squares}
                onClick={handleClick}
                isGameWon={false}
                isGameDraw={false}
                gameMode={""} />
            {showRejouerButton && <BoutonRejouer onRejouer={handleRejouer} />}

        </div>
    );
}



function calculateWinner(Squares: (string | null)[]) {
    const lines: number[][] = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]; // 
        if (Squares[a] && Squares[a] === Squares[b] && Squares[a] === Squares[c]) {
            return Squares[a];
        }
    }
    return null;
}

export default HomePageComponents;

