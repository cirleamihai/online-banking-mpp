import React, {useState} from 'react';
import {localCards} from '../LocalData/localCards.tsx';
import {handleDelete} from '../CrudHandlers/delete.js';
import {Button, Table, Pagination, Dropdown, DropdownButton} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, useNavigate} from "react-router-dom";
import "../Designs/buttons.css"
import "../Designs/customs.css"
import {sortCards} from "../CrudHandlers/dataSorting.js";

export default function HomePage() {
    let navigate = useNavigate();

    // sorting the cards
    sortCards();

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
                            const cardLink = '/view/card/' + creditCard.objectId
                            return (
                                <tr key={creditCard.objectId}>
                                    <td onClick={() => navigate(cardLink)}
                                        style={{cursor: 'pointer'}}>{creditCard.displayObjectId()}</td>
                                    <td onClick={() => navigate(cardLink)}
                                        style={{cursor: 'pointer'}}>{creditCard.cardPlaceHolder}</td>
                                    <td onClick={() => navigate(cardLink)}
                                        style={{cursor: 'pointer'}}>{creditCard.cardType}</td>
                                    <td onClick={() => navigate(cardLink)}
                                        style={{cursor: 'pointer'}}>{creditCard.last4Digits()}</td>
                                    <td><Link to={"/edit/card/" + creditCard.objectId}><Button
                                    >Edit</Button></Link> &nbsp;
                                        <Button
                                            onClick={() => handleDelete(creditCard.objectId, navigate)}>Delete</Button>
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

