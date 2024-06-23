import React, { useEffect, useState } from "react";
import BoardComponent from "./BoardComponents";
import FriendRequestComponents from "./FriendRequestComponents";
import FriendListComponents from "./friends/FriendListComponents";
import axios from "axios";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { join } from "path";
import { useUser } from "../context/UserContext";
import JoinGameModal from "./JoinGameModal";

declare global {
  interface Window {
    Echo: Echo;
    Pusher: any;
  }
}

const HomePageComponents = () => {
  const [Squares, setSquares] = useState<(string | null)[]>(
    Array(9).fill(null)
  );
  const { user } = useUser();
  const [xIsNext, setXIsNext] = useState(true);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showFriendList, setShowFriendList] = useState(false);
  const [gameCode, setGameCode] = useState("");
  const [isGameModal, setIsGameModal] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [playerX, setPlayerX] = useState("");
  const [playerO, setPlayerO] = useState("");
  const [gameCanBeLaunch, setGameCanBeLaunch] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const handleFriendRequestOpen = () => {
    setShowAddFriend(true);
  };
  const handleFriendRequestClose = () => {
    setShowAddFriend(false);
  };

  const handleFriendListOpen = () => {
    setShowFriendList(true);
  };
  const handleFriendListClose = () => {
    setShowFriendList(false);
  };

  const showGameModal = () => {
    setIsGameModal(true);
  };
  const closeGameModal = () => {
    setIsGameModal(false);
  };

  // useEffect(() => {
  //   if (user.user === null) return;

  // }, [user.user]);

  const handleClick = (i: number) => {
    if (!user || !gameStarted) return;
    const newSquares = Squares.slice();
    if (
      calculateWinner(newSquares) ||
      newSquares[i] ||
      user.username !== currentPlayer
    )
      return;
    newSquares[i] = xIsNext ? "X" : "O";
    setSquares(newSquares);
    setXIsNext(!xIsNext);
    console.log(currentPlayer)
    axios.post(process.env.REACT_APP_API_URL + "api/make-move", {
      gameCode: gameCode,
      squares: newSquares,
      xIsNext: !xIsNext,
      currentPlayer: user.username === playerX ? playerO : playerX,
    });

    setCurrentPlayer(user.username === playerX ? playerO : playerX);
  };

  useEffect(() => {
    if (window.Echo && gameCode !== "") {
      window.Echo.channel("tictactoe." + gameCode)
        .listen("UserJoined", (e: string) => {
          setGameCanBeLaunch(true);
        })
        .listen("UserMove", (e: any) => {
          setSquares(e.squares);
          setXIsNext(e.xIsNext);
          setCurrentPlayer(e.currentPlayer);
        })
        .listen("GameReady", (e: any) => {
          console.log("GameReady event received:", e);
          setPlayerX(e.playerX);
          setPlayerO(e.playerO);
          setCurrentPlayer(e.playerX); // Le joueur X commence le jeu
          setGameStarted(true);
        });
    }
  }, [gameCode]);

  const createGame = async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "api/create-game",
        {
          user: user,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.status === 201 && user) {
        const gameCode = response.data.gameCode;
        setupPusher(gameCode);

        setGameCode(gameCode);
        setPlayerX(user.username);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const joinGame = async (gameCodeJoin: string) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "api/join-game",
        {
          gameCode: gameCodeJoin,
          user: user,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (response.status === 200 && user) {
        setGameCode(gameCodeJoin);
        setPlayerO(user.username);
        await setupPusher(gameCodeJoin);
      } else {
        alert("Code de la partie invalide");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const startGame = async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "api/start-game",
        {
          gameCode: gameCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (response.status === 200) {
        setGameStarted(true);
        setGameCanBeLaunch(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setupPusher = async (gameCode: string) => {
    if (!window.Echo) {
      var pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY || "", {
        cluster: process.env.REACT_APP_PUSHER_CLUSTER || "eu",
      });

      window.Echo = new Echo({
        broadcaster: "pusher",
        key: process.env.REACT_APP_PUSHER_KEY,
        cluster: process.env.REACT_APP_PUSHER_CLUSTER,
        forceTLS: true,
      });
    }

    window.Echo.join(`tictactoe.${gameCode}`)
      .listen("UserJoined", (e: string) => {
        console.log(e);
      })
      .listen("UserLeaved", (e: string) => {
        console.log(e);
      });
  };

  const winner = calculateWinner(Squares);
  let status;
  if (winner) {
    if (winner === "X") {
      status = "Winner: " + playerX;
    } else {
      status = "Winner: " + playerO;
    }
  } else if (Squares.every((square) => square !== null)) {
    status = "Egalité";
  } else {
    status = "Joueur: " + (xIsNext ? playerX : playerO);
  }

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
        <button
          className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded "
          onClick={createGame}
        >
          Créer une partie
        </button>
        <button
          className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded "
          onClick={showGameModal}
        >
          Rejoindre une partie
        </button>
        {gameCode !== "" && <div>Code de la partie: {gameCode}</div>}
        {gameCanBeLaunch && (
          <button
            className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded "
            onClick={startGame}
          >
            Lancé la partie
          </button>
        )}
      </div>
      {showAddFriend && (
        <FriendRequestComponents onClose={handleFriendRequestClose} />
      )}
      {showFriendList && (
        <FriendListComponents onClose={handleFriendListClose} />
      )}
      {isGameModal && (
        <JoinGameModal onClose={closeGameModal} joinGame={joinGame} />
      )}
    </div>
  );
};

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
