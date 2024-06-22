import React from "react";
import axios from "axios";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useUser } from "../context/UserContext";

interface JoinGameModalProps {
  onClose: () => void;
}

const JoinGameModal: React.FC<JoinGameModalProps> = ({ onClose }) => {
  const [gameCode, setGameCode] = React.useState("");
  const user = useUser();


  const joinGame = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "api/join-game",
        {
          gameCode: gameCode,
          user: user,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log(response);
      var pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY || "", {
        cluster: process.env.REACT_APP_PUSHER_CLUSTER || "eu",
      });

      window.Echo = new Echo({
        broadcaster: "pusher",
        key: process.env.REACT_APP_PUSHER_KEY,
        cluster: process.env.REACT_APP_PUSHER_CLUSTER,
        forceTLS: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

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
              onChange={(e) => setGameCode(e.target.value)}
              className="border border-gray-400 rounded-md px-3 py-2 mb-2"
            />
            <button
              className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={joinGame}
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
