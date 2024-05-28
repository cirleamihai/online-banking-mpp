// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import {repo} from "../LocalStorage/repository";

const PrivateRoute = ({ element, route="/login", loginStatus=false, controlPanel=false}) => {
    const { user } = useContext(AuthContext);

    if (controlPanel) {
        return repo.getAdminAccess() ? element : <Navigate to={route} />;
    }

    if (loginStatus) {
        return user ? <Navigate to={route}/> : element;
    }
    return user ? element : <Navigate to={route} />;
};

export default PrivateRoute;
