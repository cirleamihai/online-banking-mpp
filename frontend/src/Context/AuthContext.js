// src/Context/AuthContext.js
import React, {createContext, useState, useEffect} from 'react';
import {repo} from '../LocalStorage/repository.js';

const LOGIN_API = `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/login`;
const REGISTER_API = `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/register`;

function jwt_decode (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = repo.getToken();
        if (token) {
            const decoded = jwt_decode(token);
            setUser(decoded);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await fetch(LOGIN_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        });

        if (response.ok) {
            const data = await response.json();
            const {token} = data;

            // store the token in our repository
            repo.setToken(token);

            // store the user in our repository
            const decoded_user = jwt_decode(token);
            repo.setUser(decoded_user);

            setUser(decoded_user);
        } else {
            // Handle login error
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
        }
    };

    const register = async (username, email, password) => {
        const response = await fetch(REGISTER_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, email, password}),
        });
        if (response.ok) {
            const data = await response.json();
            const {token} = data;

            // store the token in our repository
            repo.setToken(token);

            // store the user in our repository
            const decoded_user = jwt_decode(token);
            repo.setUser(decoded_user);

            setUser(decoded_user);
        } else {
            // Handle registration error
            const errorData = await response.json();
            throw new Error(errorData.error || 'Registration failed');
        }
    };

    const logout = () => {
        repo.setToken(null);
        repo.setUser(null);

        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, login, register, logout}}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
