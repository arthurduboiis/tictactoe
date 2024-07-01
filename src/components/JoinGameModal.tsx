import React from "react";
import axios from "axios";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useUser } from "../context/UserContext";

interface JoinGameModalProps {
    onClose: () => void;
    joinGame: (gameCode: string) => void;
}

const JoinGameModal: React.FC<JoinGameModalProps> = ({ onClose, joinGame }) => {
    const [gameCode, setInputGameCode] = React.useState("");

    return (
        <div>
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-md">
                    <h1 className="text-3xl font-bold mb-4">Rejoindre une partie</h1>
                    <form className="flex flex-col items-center">
                        <input
                            type="text"
                            placeholder="Code de la partie"
                            value={gameCode}
                            onChange={(e) => setInputGameCode(e.target.value)}
                            className="border border-gray-400 rounded-md px-3 py-2 mb-2"
                        />
                        <button
                            className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            onClick={(e) => {
                                e.preventDefault();
                                joinGame(gameCode);
                                onClose();
                            }}
                        >
                            Rejoindre
                        </button>
                    </form>
                    <div className="flex flex-col items-center">
                        <button onClick={onClose}>Fermer</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinGameModal;