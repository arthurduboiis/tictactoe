import axios from "axios";
import React from "react";
import { useUser } from "../context/UserContext";

interface RegisterProps {
  onClose: () => void;
  onOpenLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onClose, onOpenLogin }) => {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [password_confirmation, setPassword_confirmation] = React.useState("");
  const { login } = useUser();

  const onRegister = async (e: React.FormEvent<HTMLButtonElement>) => {
    if (password === password_confirmation) {
      e.preventDefault();

      await axios
        .post(process.env.REACT_APP_API_URL + "api/register", {
          username: username,
          email: email,
          password: password,
        })
        .then(async (res) => {
          console.log(res.data);
          const response = await axios.post(
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
          );
          login(response.data.user);
          onClose();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Les mots de passe ne correspondent pas");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-md">
        {/* Mettre un formu d'inscription, à voir */}
        <h1 className="text-3xl font-bold mb-4">S'inscrire</h1>
        <form className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-400 rounded-md px-3 py-2 mb-2"
          />
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-400 rounded-md px-3 py-2 mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-400 rounded-md px-3 py-2 mb-2"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setPassword_confirmation(e.target.value)}
            className="border border-gray-400 rounded-md px-3 py-2 mb-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md px-3 py-2"
            onClick={onRegister}
          >
            S'inscrire
          </button>
        </form>
        <div className="flex flex-col items-center">
          <span>
            Vous avez déjà un compte ?{" "}
            <button
              className="bg-blue-500 text-white rounded-md px-2 py-1"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                onOpenLogin();
              }}
            >
              connectez-vous ici
            </button>
          </span>
          <button onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default Register;