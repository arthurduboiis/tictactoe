import React, { useEffect, useState } from "react";
import BoardComponent from "./BoardComponents";
import FriendRequestComponents from "./FriendRequestComponents";
import FriendListComponents from "./friends/FriendListComponents";
import axios from "axios";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useUser } from "../context/UserContext";
import JoinGameModal from "./JoinGameModal";

declare global {
  interface Window {
    Echo: Echo;
    Pusher: any;
  }
}

const HomePageComponents = () => {
  const [Squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null));
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
  const [isLocalGame, setIsLocalGame] = useState(true);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | null>(null);

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

  const handleClick = (i: number) => {
    if (!isLocalGame && (!user || !gameStarted)) return;
    const newSquares = Squares.slice();
    if (calculateWinner(newSquares) || newSquares[i]) return;

    newSquares[i] = xIsNext ? "X" : "O";
    setSquares(newSquares);
    setXIsNext(!xIsNext);

    if (!isLocalGame && user) {
      axios.post(process.env.REACT_APP_API_URL + "api/make-move", {
        gameCode: gameCode,
        squares: newSquares,
        xIsNext: !xIsNext,
        currentPlayer: user.username === playerX ? playerO : playerX,
      });
      setCurrentPlayer(user.username === playerX ? playerO : playerX);
    } else if (isLocalGame && difficulty) {
      // CA permet de retarder le coup de l'ordi, peux être réduire un peu si c'est trop long,ca me parrait correcte pour l'instant.
      setTimeout(() => makeComputerMove(newSquares), 500);
    }
  };

  const makeComputerMove = (squares: (string | null)[]) => {
    let move;
    if (difficulty === "easy") {
      move = getRandomMove(squares);
    } else if (difficulty === "medium") {
      move = getMediumMove(squares);
    } else if (difficulty === "hard") {
      move = getBestMove(squares, false);
    }

    if (move !== null && move !== undefined) {
      squares[move] = "O";
      setSquares(squares);
      setXIsNext(true);
    }

  };

  const getRandomMove = (squares: (string | null)[]) => {
    const emptySquares = squares
      .map((square, index) => (square === null ? index : null))
      .filter((index) => index !== null);
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  };

  const getMediumMove = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[c] === null) return c;
      if (squares[a] && squares[a] === squares[c] && squares[b] === null) return b;
      if (squares[b] && squares[b] === squares[c] && squares[a] === null) return a;
    }

    return getRandomMove(squares);
  };

  const getBestMove = (squares: (string | null)[], isMaximizing: boolean): number | null => {
    const winner = calculateWinner(squares);
    if (winner === "X") return -1;
    if (winner === "O") return 1;
    if (squares.every((square) => square !== null)) return 0;

    const moves: { index: number; score: number }[] = [];

    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        const newSquares = squares.slice();
        newSquares[i] = isMaximizing ? "O" : "X";
        const score = getBestMove(newSquares, !isMaximizing);
        if (score !== null && score !== undefined) {
          moves.push({ index: i, score });
        }
      }
    }

    let bestMove: number | null = null;
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let move of moves) {
        if (move.score > bestScore) {
          bestScore = move.score;
          bestMove = move.index;
        }
      }
    } else {
      let worstScore = Infinity;
      for (let move of moves) {
        if (move.score < worstScore) {
          worstScore = move.score;
          bestMove = move.index;
        }
      }
    }

    return bestMove;
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
          setCurrentPlayer(e.playerX);
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
        setIsLocalGame(false);
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
        setIsLocalGame(false);
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

  const startLocalGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setIsLocalGame(true);
    setDifficulty(null);
  };

  const startComputerGame = (level: "easy" | "medium" | "hard") => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setIsLocalGame(true);
    setDifficulty(level);
  };

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
        <button
          className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded "
          onClick={startLocalGame}
        >
          Jouer en local
        </button>
        <button
          className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded "
          onClick={() => startComputerGame("easy")}
        >
          Jouer contre l'ordinateur (Facile)
        </button>
        <button
          className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded "
          onClick={() => startComputerGame("medium")}
        >
          Jouer contre l'ordinateur (Intermédiaire)
        </button>
        <button
          className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded "
          onClick={() => startComputerGame("hard")}
        >
          Jouer contre l'ordinateur (Difficile)
        </button>
        {gameCode !== "" && <div>Code de la partie: {gameCode}</div>}
        {gameCanBeLaunch && (
          <button
            className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded "
            onClick={startGame}
          >
            Lancer la partie
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

export function calculateWinner(Squares: (string | null)[]) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (Squares[a] && Squares[a] === Squares[b] && Squares[a] === Squares[c]) {
      return Squares[a];
    }
  }
  return null;
}

export default HomePageComponents;
