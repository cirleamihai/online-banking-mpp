import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {repo} from "../LocalStorage/repository.js";
import CardsHomePage from "./CardsHomePage";
import PrivateRoute from "./PrivateRoute";

const CrudProtectedRoute = ({ element, path = "/" }) => {
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        if (!repo.getCrudPerms()) {
            window.alert("You do not have permission to access this page.");
            setShouldRedirect(true);
        }
    }, []);

    return shouldRedirect ? <Navigate to={path} /> : <PrivateRoute element={element}/>;
};

export default CrudProtectedRoute;