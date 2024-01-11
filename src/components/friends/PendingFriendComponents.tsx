import React from "react";
import { User } from "../../context/UserContext";
import axios from "axios";

interface PendingFriendProps {
  pendingFriends: User[];
}

const PendingFriendComponents: React.FC<PendingFriendProps> = ({ pendingFriends }) => {
  const acceptFriend = async (
    event: React.FormEvent<HTMLButtonElement>,
    username: string
  ) => {
    event.preventDefault();
    axios
      .post(
        process.env.REACT_APP_API_URL + "accept-friend",
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
    pendingFriends.splice(
      pendingFriends.findIndex((friend) => friend.username === username),
      1
    );
  };

  const rejectFriend = async (
    event: React.FormEvent<HTMLButtonElement>,
    username: string
  ) => {
    event.preventDefault();
    axios
      .post(
        process.env.REACT_APP_API_URL + "reject-friend",
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
    pendingFriends.splice(
      pendingFriends.findIndex((friend) => friend.username === username),
      1
    );
  };

  return (
    <div>
     

      {pendingFriends ? pendingFriends.map((friend) => (
        <div key={friend.id} className="flex items-start justify-center gap-2">
          <span className="grow shrink-0">{friend.username}</span>
          <button
            type="button"
            onClick={(event) => acceptFriend(event, friend.username)}
          >
            ✅
          </button>
          <button
            type="button"
            onClick={(event) => rejectFriend(event, friend.username)}
          >
            ❌
          </button>
        </div>
      )): <span>Vous n'avez pas de demande d'amis</span>}
    </div>
  );
};

export default PendingFriendComponents;