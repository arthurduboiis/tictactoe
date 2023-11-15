import React from 'react';

interface LoginProps {
    username: string;
    password: string;
    onLogin: () => void;
    onClose: () => void;
}
// Changer cette partie avec le code que les autres ont fait. Pareil pour le registerCompo
const Login: React.FC<LoginProps> = ({ username, password, onLogin, onClose }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-4">Login</h1>
            <form className="flex flex-col items-center">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    className="border border-gray-400 rounded-md px-3 py-2 mb-2"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
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
        </div>
    );
};

export default Login;
