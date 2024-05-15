import React, {useState, useEffect} from 'react';
import {handleDelete} from '../Utils/delete.js';
import {Button, Table, Pagination, Dropdown, DropdownButton} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, useNavigate} from "react-router-dom";
import "../Designs/buttons.css"
import "../Designs/customs.css"
import {sortCards} from "../Utils/dataSorting.js";
import CreditCard from "../Model/card";
import {checkBackendHealth, fetchAPIObjects} from "../Utils/backendHandlers.js";

const API_GET_ALL_URL = 'http://localhost:8000/api/v1/credit-cards';
const API_HEALTH_CHECK = 'http://localhost:8000/health';
const API_DELETE_URL = 'http://localhost:8000/api/v1/credit-cards';
const API_SOCKET_UPDATER = 'ws://localhost:8080';

export default function HomePage() {
    // states for API data
    const [localCards, setLocalCards] = useState([]);
    const [backendIsDown, setBackendIsDown] = useState(false);

    // States for pagination
    const [requestedNewPage, setRequestedNewPage] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);


    const fetcherArgs = [API_GET_ALL_URL, setLocalCards, 'cards', CreditCard, currentPage, itemsPerPage];

    // Fetching the data from the API
    useEffect(() => {
        fetchAPIObjects(...fetcherArgs).then();
    }, [itemsPerPage, currentPage]);

    useEffect(() => {
        console.log("Checking the backend health");
        checkBackendHealth(API_HEALTH_CHECK, fetcherArgs, setBackendIsDown).then();

        const interval = setInterval(() => {
            checkBackendHealth(API_HEALTH_CHECK, fetcherArgs, setBackendIsDown).then();
        }, 5000);

        return () => clearInterval(interval);
    }, [itemsPerPage, currentPage]);

    useEffect(() => {
        const socket = new WebSocket(API_SOCKET_UPDATER);

        socket.addEventListener('message', function (event) {
            if (event.data === 'update') {
                // Fetch the updated data from the backend
                console.log('Data updated, fetch new data here');

                fetchAPIObjects(...fetcherArgs).then();
            }
        });

        // Cleanup on component unmount
        return () => socket.close();
    }, []);


    // Debounce function
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - 5) {
                setCurrentPage(prevPage => prevPage + 1);
            }
        };

        const debouncedHandleScroll = debounce(handleScroll, 100);  // Debounce time in milliseconds

        window.addEventListener('scroll', debouncedHandleScroll);
        return () => window.removeEventListener('scroll', debouncedHandleScroll);
    }, []);


    // navigator
    let navigate = useNavigate();

    // Calculate the number of pages
    const totalPages = Math.ceil(localCards.length / itemsPerPage);

    return (
        <>
            {backendIsDown && (
                <div style={{backgroundColor: 'red', color: 'white', padding: '10px', textAlign: 'center'}}>
                    The backend server is currently offline. Please try again later.
                </div>
            )}
            <div className="d-flex justify-content-between control-section">
            <Link className="d-grip gap-2" to="/purchases">
                <Button size="lg" className="btn btn-primary">View Purchases</Button>
            </Link>
            <div className="dropdown-container">
                <DropdownButton id="dropdown-item-button" title={`Items per page: ${itemsPerPage}`}>
                    {[50, 100].map(number => (
                        <Dropdown.Item key={number} as="button" onClick={() => setItemsPerPage(number)}>
                            {number}
                        </Dropdown.Item>
                    ))}
                </DropdownButton>
            </div>
            </div>
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
                        localCards.length > 0 ? localCards.map((creditCard) => {
                            const cardLink = '/view/card/' + creditCard.id;

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
                                            onClick={() => {
                                                handleDelete(API_DELETE_URL, creditCard,
                                                    fetchAPIObjects, fetcherArgs);
                                            }}>Delete</Button>
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
        </>
    )
}

