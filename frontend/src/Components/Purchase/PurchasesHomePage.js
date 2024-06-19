import {Link, useNavigate} from "react-router-dom";
import {Button, Dropdown, DropdownButton, Pagination, Table} from "react-bootstrap";
import {handleDelete} from "../../Utils/delete";
import {checkBackendHealth, fetchAPIObjects} from "../../Utils/backendHandlers";
import "../../Designs/buttons.css"
import "../../Designs/customs.css"
import React, {useEffect, useState} from "react";
import Purchase from "../../Model/purchase.js";
import {repo} from "../../LocalStorage/repository.js";

const API_GET_ALL_URL = `${process.env.REACT_APP_BACKEND_URL}/api/v1/purchases`;
const API_HEALTH_CHECK = `${process.env.REACT_APP_BACKEND_URL}/health`;
const API_DELETE_URL = API_GET_ALL_URL;
const API_SOCKET_UPDATER = process.env.REACT_APP_WS_URL;

function PurchasesHomePage() {
    const [localPurchases, setLocalPurchases] = useState([]);
    const [backendIsDown, setBackendIsDown] = useState(false);
    const fetcherArgs = [API_GET_ALL_URL, setLocalPurchases, 'purchases', Purchase];
    localPurchases.sort((a, b) => b.totalValue - a.totalValue);

    // Fetching the data from the API
    useEffect(() => {
        fetchAPIObjects(...fetcherArgs).then(r => {
        });
    }, []);

    useEffect(() => {
        checkBackendHealth(API_HEALTH_CHECK, fetcherArgs, setBackendIsDown).then(r => {
        });

        const interval = setInterval(() => {
            checkBackendHealth(API_HEALTH_CHECK, fetcherArgs, setBackendIsDown).then(r => {
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [])


    useEffect(() => {
        const socket = new WebSocket(API_SOCKET_UPDATER);

        socket.addEventListener('message', function (event) {
            if (event.data === 'update') {
                // Fetch the updated data from the backend
                console.log('Data updated, fetch new data here');

                fetchAPIObjects(...fetcherArgs).then(r => {
                });
            }
        });

        // Cleanup on component unmount
        return () => socket.close();
    }, []);

    let navigate = useNavigate();

    // States for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [purchasesPerPage, setPurchasesPerPage] = useState(5);

    // Calculate the number of pages
    const totalPages = Math.ceil(localPurchases.length / purchasesPerPage);

    // Get current purchases
    const indexOfLastPurchase = currentPage * purchasesPerPage;
    const indexOfFirstPurchase = indexOfLastPurchase - purchasesPerPage;
    const currentPurchases = localPurchases.slice(indexOfFirstPurchase, indexOfLastPurchase);

    // Change page
    const changePage = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            {backendIsDown && (
                <div style={{backgroundColor: 'red', color: 'white', padding: '10px', textAlign: 'center'}}>
                    The backend server is currently offline. Please try again later.
                </div>
            )}
            <Link className="d-grip gap-2" to="/cards">
                <Button size="lg" className="btn btn-primary">View Cards</Button>
            </Link>
            <div style={{margin: "5rem"}}>
                <Table striped bordered hover size="sm" className="cards-table-color custom-table-hover">
                    <thead>
                    <tr>
                        <th>Purchase ID</th>
                        <th>Merchant</th>
                        <th>Total Value</th>
                        <th>Card Number</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        currentPurchases.length > 0 ? currentPurchases.map((purchase) => {
                            const cardLink = '/view/card/' + purchase.cardID;
                            return (
                                <tr key={purchase.id}>
                                    <td>{purchase.displayObjectId()}</td>
                                    <td>{purchase.merchant}</td>
                                    <td>{purchase.totalValue}</td>
                                    <td onClick={() => navigate(cardLink)}
                                        style={{cursor: 'pointer'}}>{purchase.cardLast4Digits()}</td>
                                    <td className="text-center">
                                        {
                                            repo.getCrudPerms() ? (
                                                <Button
                                                    onClick={() => handleDelete(API_DELETE_URL, purchase,
                                                        fetchAPIObjects, fetcherArgs)}>Delete</Button>
                                            ) : null
                                        }
                                    </td>
                                </tr>
                            )
                        }) : <tr>
                            <td colSpan="4" align="center">No Purchases</td>
                        </tr>
                    }</tbody>
                </Table>
                {repo.getCrudPerms() &&
                    <div className="text-center">
                        <Link className="d-grip gap-2" to="/purchase/add">
                            <Button size="lg" className="submit-btn">Add Purchase</Button></Link>
                    </div>
                }
            </div>
            <div className="d-flex justify-content-between control-section">
                {/* Pagination container */}
                <div className="pagination-container">
                    <Pagination>
                        {[...Array(totalPages).keys()].map(number => (
                            <Pagination.Item key={number + 1} active={number + 1 === currentPage}
                                             onClick={() => changePage(number + 1)}>
                                {number + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </div>

                {/* Dropdown container */}
                <div className="dropdown-container">
                    <DropdownButton id="dropdown-item-button" title={`Items per page: ${purchasesPerPage}`}>
                        {[5, 10, 15].map(number => (
                            <Dropdown.Item key={number} as="button" onClick={() => setPurchasesPerPage(number)}>
                                {number}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                </div>


            </div>
        </>
    )
}

export default PurchasesHomePage;