import React, { useState } from 'react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent the default form submission
        fetch('/register', {
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
            alert(data.message); 
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return (
        <div className='login-container'>
        <div className='login-box'>
            <h1>Register</h1>
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
                    <button className='login-button' type="submit">Register</button>
                </div>
            </form>
        </div>
        <div className="challenge">
          <p className='challenge-title' >Challenge:</p>
          <p>
            If you go to the terminal instance that booted up your backend, you can see the server logs. Watch the logs as you register a user. Then try to register that username again. What happens? 
          </p>
        </div>
        </div>
        
    );
};


export default Register;
