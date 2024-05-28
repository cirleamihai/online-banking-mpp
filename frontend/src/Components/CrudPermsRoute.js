import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {repo} from "../LocalStorage/repository.js";

const CrudProtectedRoute = ({ element, path = "/" }) => {
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        if (!repo.getCrudPerms()) {
            window.alert("You do not have permission to access this page.");
            setShouldRedirect(true);
        }
    }, []);

    return shouldRedirect ? <Navigate to={path} /> : element;
};

export default CrudProtectedRoute;