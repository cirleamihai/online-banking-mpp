import React, {useState, useEffect} from 'react';
import {handleDelete} from '../CrudHandlers/delete.js';
import {Button, Table, Pagination, Dropdown, DropdownButton} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, useNavigate} from "react-router-dom";
import "../Designs/buttons.css"
import "../Designs/customs.css"
import {sortCards} from "../CrudHandlers/dataSorting.js";
import CreditCard from "../Model/card";
import {checkBackendHealth, fetchAPIObjects} from "../CrudHandlers/backendHandlers.js";
import Purchase from "../Model/purchase";

const API_GET_ALL_URL = 'http://localhost:8000/api/v1/credit-cards';
const API_GET_ALL_PURCHASES_URL = 'http://localhost:8000/api/v1/purchases';
const API_HEALTH_CHECK = 'http://localhost:8000/health';
const API_DELETE_URL = 'http://localhost:8000/api/v1/credit-cards';
const API_SOCKET_UPDATER = 'ws://localhost:8080';

export default function HomePage() {
    const [localCards, setLocalCards] = useState([]);
    const [localPurchases, setLocalPurchases] = useState([]);
    const [backendIsDown, setBackendIsDown] = useState(false);
    const fetcherArgs = [API_GET_ALL_URL, setLocalCards, 'cards', CreditCard];
    const fetcherArgs2 = [API_GET_ALL_PURCHASES_URL, setLocalPurchases, 'purchases', Purchase];

    // Fetching the data from the API
    useEffect(() => {
        fetchAPIObjects(...fetcherArgs).then(r => {
            fetchAPIObjects(...fetcherArgs2).then(r => {
            });
        });
    });

    useEffect(() => {
        checkBackendHealth(API_HEALTH_CHECK, ...fetcherArgs, setBackendIsDown).then(r => {});

        const interval = setInterval(() => {
            checkBackendHealth(API_HEALTH_CHECK, ...fetcherArgs, setBackendIsDown).then(r => {});
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const socket = new WebSocket(API_SOCKET_UPDATER);

        socket.addEventListener('message', function (event) {
            if (event.data === 'update') {
                // Fetch the updated data from the backend
                console.log('Data updated, fetch new data here');

                fetchAPIObjects(...fetcherArgs).then(r => {});
            }
        });

        // Cleanup on component unmount
        return () => socket.close();
    }, []);

    let navigate = useNavigate();

    // sorting the cards
    sortCards(localCards);

    // States for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage, setCardsPerPage] = useState(5);

    // Calculate the number of pages
    const totalPages = Math.ceil(localCards.length / cardsPerPage);

    // Get current cards
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = localCards.slice(indexOfFirstCard, indexOfLastCard);

    // Change page
    const changePage = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            {backendIsDown && (
                <div style={{backgroundColor: 'red', color: 'white', padding: '10px', textAlign: 'center'}}>
                    The backend server is currently offline. Please try again later.
                </div>
            )}
            <Link className="d-grip gap-2" to="/purchases">
                <Button size="lg" className="btn btn-primary">View Purchases</Button>
            </Link>
            <div style={{margin: "5rem"}}>
                <Table striped bordered hover size="sm" className="cards-table-color custom-table-hover">
                    <thead>
                    <tr>
                        <th>CardID</th>
                        <th>CardHolder</th>
                        <th>CardType</th>
                        <th>LastDigits</th>
                        <th>Usages</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        currentCards.length > 0 ? currentCards.map((creditCard) => {
                            const cardLink = '/view/card/' + creditCard.id;
                            creditCard.checkUsageNumber(localPurchases); // loading the usage number

                            return (
                                <tr key={creditCard.id}>
                                    <td onClick={() => navigate(cardLink)}
                                        style={{cursor: 'pointer'}}>{creditCard.displayObjectId()}</td>
                                    <td onClick={() => navigate(cardLink)}
                                        style={{cursor: 'pointer'}}>{creditCard.placeHolder}</td>
                                    <td onClick={() => navigate(cardLink)}
                                        style={{cursor: 'pointer'}}>{creditCard.type}</td>
                                    <td onClick={() => navigate(cardLink)}
                                        style={{cursor: 'pointer'}}>{creditCard.last4Digits()}</td>
                                    <td>{creditCard.usageNumber}</td>
                                    <td><Link to={"/edit/card/" + creditCard.id}><Button
                                    >Edit</Button></Link> &nbsp;
                                        <Button
                                            onClick={() => handleDelete(API_DELETE_URL, creditCard,
                                                fetchAPIObjects, fetcherArgs)}>Delete</Button>
                                    </td>
                                </tr>
                            )
                        }) : <tr>
                            <td colSpan="4" align="center">No Cards</td>
                        </tr>
                    }</tbody>
                </Table>
                <Link className="d-grip gap-2" to="/card/add">
                    <Button size="lg" className="submit-btn">Add Card</Button></Link>
                <Link className="d-grip gap-2" to="/view/chart/">
                    <Button size="lg" className="submit-btn">View Chart</Button></Link>
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
                    <DropdownButton id="dropdown-item-button" title={`Items per page: ${cardsPerPage}`}>
                        {[5, 10, 15].map(number => (
                            <Dropdown.Item key={number} as="button" onClick={() => setCardsPerPage(number)}>
                                {number}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                </div>


            </div>
        </>
    )
}

