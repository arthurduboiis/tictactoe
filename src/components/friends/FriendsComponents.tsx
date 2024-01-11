import React from "react";
import { User } from "../../context/UserContext";

interface FriendsProps {
  friends: User[];
}

const FriendsComponents: React.FC<FriendsProps> = ({ friends }) => {
  return (
    <div>
     

      {friends ? friends.map((friend) => (
        <div key={friend.id} className="flex items-start justify-center gap-2">
          <span className="grow shrink-0">{friend.username}</span>
        </div>
      )) : <span>Vous n'avez pas encore d'amis</span>}
    </div>
  );
};

export default FriendsComponents;
