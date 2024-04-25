const express = require("express");
const CreditCard = require("../models/cardModel");
const database = require("../database/databaseHandler");
const router = express.Router();
const repo = require("../repository/repository.js");

router.get("/credit-cards", (req, res) => {
    const creditCards = repo.getCreditCards();
    res.json({cards: creditCards});
});

// get a credit card by id
router.get("/credit-cards/:id", (req, res) => {
    if (!req.params.id) {
        res.status(400).json({error: "Card ID not provided."});
        return;
    }

    const creditCards = repo.getCreditCards();
    const card = creditCards.find((card) => card.id === req.params.id);
    if (card == null) {
        res.status(404).json({error: "Card not found."});
        return;
    }

    res.json({card});
});

// update a credit card
router.put("/credit-cards/:id", (req, res) => {
    const creditCards = repo.getCreditCards();
    const cardIndex = creditCards.findIndex((card) => card.id === req.params.id);

    if (cardIndex === -1) {
        res.status(404).json({error: "Card not found."});
        return;
    }

    const updatedCard = new CreditCard(req.body.card);
    database.updateData('creditCards', updatedCard).then(() => {
        res.json(`Successfully updated the ${updatedCard.placeHolder}'s card.`);
    });
});

// add a new card
router.post('/credit-cards', (req, res) => {
    const card = req.body.card;
    if (!card) {
        res.status(400).json({error: "Card details not provided."});
        return;
    }

    const newCard = new CreditCard(card);
    database.addData('creditCards', newCard).then(() => {
        res.status(201).json(newCard);
    });
});

// Delete an existing card
router.delete('/credit-cards/:id', (req, res) => {
    const creditCards = repo.getCreditCards();
    console.log(creditCards, req.params.id);
    const cardIndex = creditCards.findIndex((card) => card.id === req.params.id);
    if (cardIndex === -1) {
        res.status(404).json({error: "Card not found."});
        return;
    }

    database.deleteData('creditCards', creditCards[cardIndex]).then(() => {
        res.status(204).send();
    });
});

module.exports = router;