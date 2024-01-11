import React, { useEffect, useState } from "react";
import Header from "../components/HeaderComponents";
import HomePageComponents from "../components/HomePageComponents";
import Login from "../components/LoginComponents";
import Register from "../components/RegisterComponents";
import { useUser } from "../context/UserContext";

const Home: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const { user, logout } = useUser();

  useEffect(() => {
    if (user) {
      setShowLogin(false);
      setShowRegister(false);
    }
  }, [user]);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleRegisterClick = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleLoginClose = () => {
    setShowLogin(false);
  };

  const handleRegisterClose = () => {
    setShowRegister(false);
  };

  return (
    <div>
      <Header
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
        loggedIn={user ? true : false}
        logout={logout}
      />
      <h1 className="text-3xl font-bold text-center mb-4">Jeu de morpion</h1>

      {user && (
        <div className="flex flex-col items-center h-screen">
            <span> Welcome { user.username}</span>
          <HomePageComponents />
          
        </div>
      )}
      {showLogin && (
        <Login
          onClose={handleLoginClose}
          onOpenRegister={handleRegisterClick}
        />
      )}
      {showRegister && (
        <Register
          onClose={handleRegisterClose}
          onOpenLogin={handleLoginClick}
        />
      )}
    </div>
  );
};

export default Home;
