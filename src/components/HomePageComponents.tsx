import React, { useState } from "react";
import BoardComponent from "./BoardComponents";
import FriendRequestComponents from "./FriendRequestComponents";
import FriendListComponents from "./friends/FriendListComponents";
import axios from 'axios';

import Echo from "laravel-echo";




function HomePageComponents() {
  const [Squares, setSquares] = useState<(string | null)[]>(
    Array(9).fill(null)
  );
  const [xIsNext, setXIsNext] = useState(true);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showFriendList, setShowFriendList] = useState(false);

  const handleFriendRequestOpen = () => {
    setShowAddFriend(true);
  };
  const handleFriendRequestClose = () => {
    setShowAddFriend(false);
  };


  const handleFriendListOpen =  () => {
   
    setShowFriendList(true);
  };
  const handleFriendListClose = () => {
    setShowFriendList(false);
  };

  const handleClick = (i: number) => {
    //Fonction fait avec copilote, vérifier si elle fonctionne et voir la doc pour le Squares
    const newSquares = Squares.slice();
    if (calculateWinner(newSquares) || newSquares[i]) return;
    newSquares[i] = xIsNext ? "X" : "O";
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  };

  const winner = calculateWinner(Squares); // Cette variable est à utiliser pour déterminer si le jeu est gagné
  let status;
  if (winner) {
    // Cette condition sert a montrer le status du jeu
    status = "Winner: " + winner;
  } else if (Squares.every((square) => square !== null)) {
    // Voir le Squares.every sur la doc
    status = "Egalité";
  } else {
    status = "Joueur: " + (xIsNext ? "X" : "O"); // xIsNext est à utiliser pour déterminer quel joueur doit jouer
  }
  // window.Echo = new Echo({
  //   broadcaster: 'pusher',
  //   key: process.env.MIX_PUSHER_APP_KEY,
  //   cluster: process.env.MIX_PUSHER_APP_CLUSTER,
  //   encrypted: true, // set to true if you're using HTTPS
  // });

  // const options = {
  //   broadcaster: 'pusher',
  //   key: 'ee4c708e97f16b9f37f2',
  //   cluster: 'eu',
  //   forceTLS: false,
  //   //authEndpoint is your apiUrl + /broadcasting/auth
  //   authEndpoint: '/sanctum/csrf-cookie', 
  //   // As I'm using JWT tokens, I need to manually set up the headers.
  //   // auth: {
  //   //   headers: {
  //   //     Authorization: `Bearer ${token}`,
  //   //     Accept: 'application/json',
  //   //   },
  //   // },
  // };
  
  // const echo = new Echo(options);
  // echo.private(`App.User.${userId}`).notification((data) => {
  //     console.log(data);
  // });


  return (
    <div className=" flex flex-raw items-center justify-center bg-gray-100 p-5 mt-5 shadow-xl rounded-xl">
      <div className="self-stretch shrink"></div>
      <div className="text-center">
        <div className="text-3xl mb-4">{status}</div>
        <BoardComponent
          Squares={Squares}
          onClick={handleClick}
          isGameWon={false}
          isGameDraw={false}
          gameMode={""}
        />
      </div>
      <div className="flex flex-col text-center ml-5 gap-2">
        <button
          className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded "
          onClick={handleFriendRequestOpen}
        >
          Ajouter un ami
        </button>
        <button
          className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded "
          onClick={handleFriendListOpen}
        >
          Liste d'amis
        </button>
      </div>
      {showAddFriend && (
        <FriendRequestComponents onClose={handleFriendRequestClose} />
      )}
      {showFriendList && (
        <FriendListComponents onClose={handleFriendListClose} />
      )}
    </div>
  );
}

function calculateWinner(Squares: (string | null)[]) {
  // Fait avec chatGPT pour calculer les coups gagnants.
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

// Changer le nom de cette page plus tard lorsque le login et register seront fait pour pouvoir afficher le login en premier lorsqu'on arrive sur le site.
// Ca peut etre chiant de se login a chaque fois que j'actualise, attendre que les cookies ou tokens sont aussi implementer
