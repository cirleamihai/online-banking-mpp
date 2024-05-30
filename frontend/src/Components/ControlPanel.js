import React, {useEffect, useState} from 'react';
import {Button, Table} from 'react-bootstrap';
import User from "../Model/user";
import {checkBackendHealth, fetchAPIObjects} from "../Utils/backendHandlers";
import {Link} from "react-router-dom";
import {handleDelete} from "../Utils/delete";
import {repo} from "../LocalStorage/repository";

const API_GET_USERS = `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/`;
const API_DELETE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/`;
const API_HEALTH_CHECK = `${process.env.REACT_APP_BACKEND_URL}/health`;

const ControlPanel = () => {
    const [localUsers, setLocalUsers] = useState([]);
    const [backendIsDown, setBackendIsDown] = useState(false);

    const fetcherArgs = [API_GET_USERS, setLocalUsers, 'users', User];
    useEffect(() => {
        fetchAPIObjects(...fetcherArgs).then()
    }, []);

    useEffect(() => {
        console.log("Checking the backend health");
        checkBackendHealth(API_HEALTH_CHECK, fetcherArgs, setBackendIsDown).then();

        const interval = setInterval(() => {
            checkBackendHealth(API_HEALTH_CHECK, fetcherArgs, setBackendIsDown).then();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h1 className="text-center">Control Panel</h1>
            <br></br>
            <Table striped bordered hover size="sm" className="cards-table-color custom-table-hover">
                <thead>
                <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {localUsers.map(user => (
                    <tr key={user.id}>
                        <td>{user.displayObjectId()}</td>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                        <td><Link to={"/admin/user/edit/" + user.id}>
                            <Button>Edit</Button>
                        </Link>
                            &nbsp;
                            <Button
                                onClick={() => {
                                    handleDelete(API_DELETE_URL, user, fetchAPIObjects, fetcherArgs);
                                }}
                            >
                                Delete
                            </Button></td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <div className="d-flex justify-content-center align-items-center">
                <Link className="w-100 justify-content-center d-flex" to="/admin/user/add">
                    <Button size="lg" className="submit-btn">Add User</Button>
                </Link>
            </div>
        </div>
    );
};

export default ControlPanel;