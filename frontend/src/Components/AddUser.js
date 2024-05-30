import React, {useEffect, useState} from 'react';
import "../Designs/form.css";
import {useNavigate} from "react-router-dom";
import {repo} from "../LocalStorage/repository";
import {authFetch} from "../Utils/autoFetch";
import User from "../Model/user";

const URL_ADD_DATA = `${process.env.REACT_APP_BACKEND_URL}/api/v1/users`

export default function AddUser() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = new User({username, email, password, role});
        const response = await authFetch(URL_ADD_DATA, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({user}),
        });
        if (response.ok) {
            const data = await response.json();
            if (!user.isAdmin()) {
                repo.addUser(user);
            }
            navigate('/admin');
        } else {
            setError('Failed to register');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <select
                name="accessRole"
                value={role}
                onChange={(e) => setRole(e.target.value)}
            >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>

            </select>
            <button type="submit">Register</button>
            {error && <p>{error}</p>}
        </form>
    );
}