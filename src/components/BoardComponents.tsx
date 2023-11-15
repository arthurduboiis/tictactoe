import React from "react";
import SquareComponent from "./SquareComponents";
import './BoardComponents.css';

interface BoardProps {
    Squares: (string | null)[];
    onClick: (i: number) => void;
    isGameWon: boolean;
    isGameDraw: boolean;
    gameMode: string;
}

function BoardComponent({ Squares, onClick, isGameWon, isGameDraw, gameMode }: BoardProps) {
    const renderSquare = (i: number) => {
        const isWinnerSquare = isGameWon && Squares[i] === Squares[0];
        const isDrawSquare = isGameDraw && !Squares[i];
        return (
            <SquareComponent
                value={Squares[i]}
                onClick={() => onClick(i)}
                isWinnerSquare={isWinnerSquare}
                isDrawSquare={isDrawSquare}
            />
        );
    };

    return (
        <div className={`grid grid-cols-3 gap-5 w-72 ${isGameWon ? 'animate-won' : ''}`}>
            {Array(9)
                .fill(null)
                .map((_, i) => (
                    <div
                        key={i}
                        className={`${isGameDraw ? 'animate-draw' : ''}`}
                    >
                        {renderSquare(i)}
                    </div>
                ))}
        </div>
    );
}

export default BoardComponent;
