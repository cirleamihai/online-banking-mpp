const express = require("express");
const CreditCard = require("../models/cardModel");
const database = require("../database/databaseHandler");
const router = express.Router();
const repo = require("../repository/repository.js");

router.get("/credit-cards", async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || -1;
    const offset = (page - 1) * limit;

    const creditCards = await repo.getCreditCards(offset, limit);
    res.json({cards: creditCards});
});

// get a credit card by id
router.get("/credit-cards/:id", async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({error: "Card ID not provided."});
        return;
    }

    const card = await repo.getCreditCardByID(req.params.id);
    if (!card.isTruthy()) {
        res.status(404).json({error: "Card not found."});
        return;
    }

    res.json({card});
});

// update a credit card
router.put("/credit-cards/:id", async (req, res) => {
    const creditCard = await repo.getCreditCardByID(req.params.id);

    if (!creditCard.isTruthy()) {
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
router.delete('/credit-cards/:id', async (req, res) => {
    const creditCard = await repo.getCreditCardByID(req.params.id);
    if (!creditCard.isTruthy()) {
        res.status(404).json({error: "Card not found."});
        return;
    }

    database.deleteData('creditCards', creditCard, req.params.id).then(() => {
        res.status(204).send();
    });
});

module.exports = router;