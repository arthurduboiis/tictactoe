import React from "react";
import axios from "axios";
import { useUser } from "../context/UserContext"; // Import the useUser hook

interface LoginProps {
  onClose: () => void;
  onOpenRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose, onOpenRegister }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { login } = useUser();

  const onLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await axios.get(process.env.REACT_APP_API_URL + "sanctum/csrf-cookie");

      const response = await axios
        .post(
          process.env.REACT_APP_API_URL + "api/login",
          {
            email: email,
            password: password,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
      login(response.data.user);
      onClose();
    } catch (error) {
      console.log(error);
    }
    

    
     
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-md">
        <h1 className="text-3xl font-bold mb-4">Se connecter</h1>
        <form className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-400 rounded-md px-3 py-2 mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-400 rounded-md px-3 py-2 mb-2"
          />
          <button
            type="submit"
            onClick={onLogin}
            className="bg-blue-500 text-white rounded-md px-3 py-2"
          >
            Login
          </button>
        </form>
        <div className="flex flex-col items-center">
          <span>
            Vous n'avez pas de compte ?{" "}
            <button
              className="bg-blue-500 text-white rounded-md px-2 py-1"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                onOpenRegister();
              }}
            >
              Inscrivez-vous ici
            </button>
          </span>
          <button onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
