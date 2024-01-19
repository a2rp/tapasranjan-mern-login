import axios from 'axios';
import React, { useState } from 'react'

const App = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleLogin = async (event) => {
        event.preventDefault();

        console.log(email, password);

        try {
            const config = {
                url: "http://localhost:8911/api/v1/user/login",
                method: "POST",
                data: { email, password }
            };
            const response = await axios(config);
            console.log(response);
        } catch (error) {
            console.log(error);
        }

    };

    return (
        <div style={{ padding: "30px" }}>
            <h1>Login form</h1>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={event => setEmail(event.target.value)} />
                <hr />
                <input type="password" placeholder="Password" value={password} onChange={event => setPassword(event.target.value)} />
                <hr />
                <button type="submit">Submit</button>
            </form>

        </div>
    )
}

export default App

