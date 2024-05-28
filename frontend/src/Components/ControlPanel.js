import React, {useEffect, useState} from 'react';
import {Table} from 'react-bootstrap';

const ControlPanel = () => {
    const [users, setUsers] = useState([]);

    // useEffect(() => {
    //     fetchRegisteredUsers().then(setUsers);
    // }, []);

    return (
        <div>
            <h1>Control Panel</h1>
            <br></br>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Role</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ControlPanel;