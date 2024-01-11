import React from "react";

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  loggedIn: boolean;
  logout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onLoginClick,
  onRegisterClick,
  loggedIn,
  logout
}) => {
 return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div>
        <h1 className="text-2xl font-bold">Jeux</h1>
        <ul className="flex space-x-4">
          <li>Jouer en solo</li>
          <li>Jouer en ligne</li>
          <li>Jouer contre l'IA</li>
        </ul>
      </div>

      {loggedIn && (
        <button className="text-white" onClick={logout}>
          Déconnexion
        </button>
      )}
      {!loggedIn && (
        <div>
          <button className="text-white" onClick={onLoginClick}>
            Connexion
          </button>
          <span className="mx-2">|</span>
          <button className="text-white" onClick={onRegisterClick}>
            Pas de compte ? S'inscrire maintenant
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
