import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        fetch('/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            //alert(data.message); // FIX THIS LATER 
            if (data.success) {
            login();
            navigate('/');
            }        
            })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return (
        <div className='login-container'>
        <div className='login-box'>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className='form-input'>
                    <label className='form-label'>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className='form-input'>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className='form-button'>
                    <button className='login-button' type="submit">Login</button>
                </div>
            </form>
        </div>
        <div className="challenge">
          <p className='challenge-title' >Challenge:</p>
          <p>
            Use a database client (I like DBeaver, there are others) to connect to the SQLite database and try to find your password. Good luck!
          </p>
        </div>
        </div>
        
    );
};

export default Login;
