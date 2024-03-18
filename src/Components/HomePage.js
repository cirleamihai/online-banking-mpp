import React from 'react';
import {localCards} from '../LocalData/localCards.tsx';
import {handleDelete} from '../CrudHandlers/delete.js';
import {Button, Table} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, useNavigate} from "react-router-dom";
import "../Designs/buttons.css"

export default function HomePage() {
    let navigate = useNavigate();

    return (
        <>
            <div style={{margin: "10rem"}}>
                <Table striped bordered hover size="sm">
                    <thead>
                    <tr>
                        <th>CardID</th>
                        <th>CardName</th>
                        <th>CardType</th>
                        <th>LastDigits</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {localCards.length > 0 ? localCards.map((creditCard) => {
                        const cardLink = '/view/card/' + creditCard.objectId
                        return (
                            <tr key={creditCard.objectId}>
                                <td onClick={() => navigate(cardLink)} style={{ cursor: 'pointer' }}>{creditCard.displayObjectId()}</td>
                                <td onClick={() => navigate(cardLink)} style={{ cursor: 'pointer' }}>{creditCard.cardTitle}</td>
                                <td onClick={() => navigate(cardLink)} style={{ cursor: 'pointer' }}>{creditCard.cardType}</td>
                                <td onClick={() => navigate(cardLink)} style={{ cursor: 'pointer' }}>{creditCard.last4Digits()}</td>
                                <td><Link to={"/edit/card/" + creditCard.objectId}><Button
                                    >Edit</Button></Link> &nbsp;
                                    <Button onClick={(event) => handleDelete(creditCard.objectId, navigate)}>Delete</Button></td>
                            </tr>
                        )
                    }) : <tr>
                        <td colSpan="4" align="center">No Cards</td>
                    </tr>
                    }</tbody>
                </Table>
                <Link className="d-grip gap-2" to="/card/add">
                    <Button size="lg" className="submit-btn">Add Card</Button></Link>
            </div>
        </>
    )
}

