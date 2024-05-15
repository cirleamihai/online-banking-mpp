// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const PrivateRoute = ({ element }) => {
    const { user } = useContext(AuthContext);

    return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
