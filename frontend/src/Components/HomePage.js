import React, {useState, useEffect} from 'react';
import {handleDelete} from '../CrudHandlers/delete.js';
import {Button, Table, Pagination, Dropdown, DropdownButton} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, useNavigate} from "react-router-dom";
import "../Designs/buttons.css"
import "../Designs/customs.css"
import {sortCards} from "../CrudHandlers/dataSorting.js";
import CreditCard from "../Model/card";

const API_GET_ALL_URL = 'http://localhost:8000/api/v1/credit-cards';
const API_HEALTH_CHECK = 'http://localhost:8000/health';
const API_SOCKET_UPDATER = 'ws://localhost:8080';

export default function HomePage() {
    const [localCards, setLocalCards] = useState([]);
    const [backendIsDown, setBackendIsDown] = useState(false);

    // Fetching the data from the API
    useEffect(() => {
        fetchAllCards();
    }, []);

    useEffect(() => {
        const checkBackendHealth = () => {
            fetch(API_HEALTH_CHECK).then(response => {
                if (response.ok) {
                    setBackendIsDown(false);
                    fetchAllCards();
                } else {
                    throw new Error('Backend is down');
                }
            }).catch(error => {
                console.log(error);
                fetchAllCards();
                setBackendIsDown(true);
            })
        }

        checkBackendHealth();

        const interval = setInterval(() => {
            checkBackendHealth();
        }, 5000);

        return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        const socket = new WebSocket(API_SOCKET_UPDATER);

        socket.addEventListener('message', function (event) {
            if (event.data === 'update') {
                // Fetch the updated data from the backend
                console.log('Data updated, fetch new data here');

                fetchAllCards();
            }
        });

        // Cleanup on component unmount
        return () => socket.close();
    }, []);

    const fetchAllCards = async () => {
        fetch(API_GET_ALL_URL)
            .then(response => response.json())
            .then(data => {
                const cards = data.cards.map(card => new CreditCard(card));
                setLocalCards(cards);
                console.log(cards);
            })
            .catch(error => {
                console.error(error);
                setLocalCards([]);
            });
    }

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
            <div style={{margin: "10rem"}}>
                <Table striped bordered hover size="sm" className="cards-table-color custom-table-hover">
                    <thead>
                    <tr>
                        <th>CardID</th>
                        <th>CardHolder</th>
                        <th>CardType</th>
                        <th>LastDigits</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        currentCards.length > 0 ? currentCards.map((creditCard) => {
                            const cardLink = '/view/card/' + creditCard.id
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
                                    <td><Link to={"/edit/card/" + creditCard.id}><Button
                                    >Edit</Button></Link> &nbsp;
                                        <Button
                                            onClick={() => handleDelete(creditCard.id, fetchAllCards)}>Delete</Button>
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
            <div className="d-flex justify-content-between">
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

