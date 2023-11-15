    import React from 'react';
    import axios from 'axios';
   

    const Login: React.FC = () => {

        const [email, setEmail] = React.useState('');
        const [password, setPassword] = React.useState('');
        const onLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
            e.preventDefault();
            await axios.get(process.env.REACT_APP_API_URL + 'sanctum/csrf-cookie')
            .then(response => {
                axios.post(process.env.REACT_APP_API_URL + 'api/login', {
                    email: email,
                    password: password
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                
                    }
                }).then((res) => {
                    console.log(res.data);
                }).catch((err) => {
                    console.log(err);
                }
                );
    
            })
            .catch(error => {
              console.log(error)
            });
          
        };
    

       

        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-3xl font-bold mb-4">Login</h1>
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
            </div>
        );
    };

    export default Login;
