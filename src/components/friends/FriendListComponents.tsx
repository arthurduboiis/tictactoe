import React from "react";
import axios from "axios";
import { User } from "../../context/UserContext";
import { get } from "http";
import PendingFriendComponents from "./PendingFriendComponents";
import FriendsComponents from "./FriendsComponents";

interface FriendRequestProps {
  onClose: () => void;
}

enum Tab {
  FRIENDS,
  PENDING_FRIENDS,
}

const FriendRequestComponents: React.FC<FriendRequestProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = React.useState(Tab.FRIENDS);
  const [pendingFriends, setPendingFriendsList] = React.useState<User[]>([]);
  const [friends, setFriendList] = React.useState<User[]>([]);

  const getFriend = async () => {
    const result = await axios.get(
      process.env.REACT_APP_API_URL + "api/get-friend",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    setFriendList(result.data.friends);
  };

  const getPendingFriend = async () => {
    const result = await axios.get(
      process.env.REACT_APP_API_URL + "api/pending-friend",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    console.log(result.data.pending_friend);
    setPendingFriendsList(result.data.pending_friend);
  };

  React.useEffect(() => {
    try {
      if (activeTab === Tab.FRIENDS) {
        console.log("get friend");
        getFriend();
      } else {
        console.log("get pending friend");
        getPendingFriend();
      }
    } catch (error) {
      console.log(error);
    }
  }, [activeTab]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-md">
        <div className="flex justify-center mb-4">
          <button
            className={`mr-4 ${activeTab === Tab.FRIENDS ? "font-bold" : ""}`}
            onClick={() => handleTabChange(Tab.FRIENDS)}
          >
            Listes d'amis
          </button>
          <button
            className={`${activeTab === Tab.PENDING_FRIENDS ? "font-bold" : ""
              }`}
            onClick={() => handleTabChange(Tab.PENDING_FRIENDS)}
          >
            Demandes d'amis
          </button>
        </div>
        {/* to put the line in dark */}
        <hr className="mb-4 border-black" />

        {activeTab === Tab.FRIENDS && <FriendsComponents friends={friends} />}
        {activeTab === Tab.PENDING_FRIENDS && (
          <PendingFriendComponents pendingFriends={pendingFriends} />
        )}

        <div className="flex flex-col items-center mt-4">
          <button onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default FriendRequestComponents;