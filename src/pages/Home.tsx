import React, { useState } from 'react';
import Header from '../components/HeaderComponents';
import HomePageComponents from '../components/HomePageComponents';
import Login from '../components/LoginComponents';
import Register from '../components/RegisterComponents';

const Home: React.FC = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

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
            <Header onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
            <h1 className="text-3xl font-bold text-center mb-4">Jeu de morpion</h1>
            <div className="flex justify-center items-center h-screen">
                <HomePageComponents />
            </div>
            {showLogin && <Login onClose={handleLoginClose} username={''} password={''} onLogin={function (): void {
                throw new Error('Function not implemented.');
            }} />}
            {showRegister && <Register onClose={handleRegisterClose} />}
        </div>
    );
};

export default Home;
