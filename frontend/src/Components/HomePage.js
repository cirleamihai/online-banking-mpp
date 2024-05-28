import React, {useContext} from 'react';
import {Button, Table, Pagination, Dropdown, DropdownButton} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, useNavigate} from "react-router-dom";
import "../Designs/buttons.css"
import "../Designs/customs.css"
import {AuthContext} from "../Context/AuthContext";
import {repo} from "../LocalStorage/repository";

export default function HomePage() {
    // Auth Context
    const {logout} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogOut = async () => {
        try {
            await logout();
            repo.clearLocalStorage();
            navigate('/login');
        } catch (error) {
            console.log(error);
        }
    }
    // return buttons to navigate to other pages
    return (<div className="container d-flex flex-column align-items-center justify-content-center"
                 style={{height: '100vh'}}>
            <div className="row w-100">
                <div className="col d-flex justify-content-center mb-3">
                    <Link to="/login">
                        <Button size="lg" className="btn btn-danger" onClick={handleLogOut}>Logout</Button>
                    </Link>
                </div>
                <div className="col d-flex justify-content-center mb-3">
                    <Link to="/cards">
                        <Button size="lg" className="btn btn-primary">View Cards</Button>
                    </Link>
                </div>
                <div className="col d-flex justify-content-center mb-3">
                    <Link to="/purchases">
                        <Button size="lg" className="btn btn-primary">View Purchases</Button>
                    </Link>
                </div>
                {repo.getAdminAccess() && (
                    <div className="col d-flex justify-content-center mb-3">
                        <Link to="/admin">
                            <Button size="lg" className="btn btn-primary">Control Panel</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>

    )
}

