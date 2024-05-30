import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import "../Designs/form.css";
import {repo} from "../LocalStorage/repository";
import {authFetch} from "../Utils/autoFetch";
import User from "../Model/user";

const URL_ADD_DATA = `${process.env.REACT_APP_BACKEND_URL}/api/v1/users`

export default function EditUser() {
    const navigate = useNavigate();
    const {userId} = useParams()
    const localUser = repo.getUserById(userId);
    const [username, setUsername] = useState(localUser.username);
    const [email, setEmail] = useState(localUser.email);
    const [password, setPassword] = useState(localUser.password);
    const [role, setRole] = useState(localUser.role);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = new User({username, email, password, role});
        user.id = userId;

        const response = await authFetch(URL_ADD_DATA + `/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({user}),
        });
        if (response.ok) {
            const data = await response.json();
            repo.updateUser(user);
            navigate('/admin');
        } else {
            setError('Something went wrong');
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