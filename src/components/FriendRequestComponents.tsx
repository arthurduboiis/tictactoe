import axios from "axios";
import { response } from "express";
import React, { useState } from "react";

interface FriendRequestProps {
  onClose: () => void;
}

const FriendRequestComponents: React.FC<FriendRequestProps> = ({ onClose }) => {
  const [username, setUsername] = useState("");

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await axios.get(process.env.REACT_APP_API_URL + "sanctum/csrf-cookie");
    axios
      .post(
        process.env.REACT_APP_API_URL + "api/add-friend",
        {
          username: username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-md">
        <h1 className="text-3xl font-bold mb-4">Ajouter un ami</h1>
        <form className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Surnom"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-400 rounded-md px-3 py-2 mb-2"
          />
          <button
            className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            Ajouter
          </button>
        </form>
        <div className="flex flex-col items-center">
          <button onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default FriendRequestComponents;
