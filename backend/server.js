const express = require("express");
const cors = require("cors");
const app = express();
const creditCards = require("./localStorage.js");
const CreditCard = require("./cardModel.js");
const {v4: uuidv4} = require('uuid');

app.use(cors());
app.use(express.json());

app.get("/api/v1/credit-cards", (req, res) => {
    res.json({cards: creditCards});
});

app.get("/api/v1/credit-cards/:id", (req, res) => {
    if (!req.params.id) {
        res.status(400).json({error: "Card ID not provided."});
        return;
    }

    const card = creditCards.find((card) => card.id === req.params.id);
    if (card == null) {
        res.status(404).json({error: "Card not found."});
        return;
    }

    res.json({card});
});

app.put("/api/v1/credit-cards/:id", (req, res) => {
    const cardIndex = creditCards.findIndex((card) => card.id === req.params.id);

    if (cardIndex === -1) {
        res.status(404).json({error: "Card not found."});
        return;
    }

    creditCards[cardIndex] = new CreditCard(req.body.card);
    res.json(`Successfully updated the ${creditCards[cardIndex].placeHolder}'s card.`);
});

// Add a new card
app.post('/api/v1/credit-cards', (req, res) => {
    const card = req.body.card;
    if (!card) {
        res.status(400).json({error: "Card details not provided."});
        return;
    }

    card.id = uuidv4();
    const newCard = new CreditCard(card);
    creditCards.push(newCard);
    res.status(201).json(newCard);
});


// Delete an existing card
app.delete('/api/v1/credit-cards/:id', (req, res) => {
    const cardIndex = creditCards.findIndex((card) => card.id === req.params.id);
    if (cardIndex === -1) {
        res.status(404).json({error: "Card not found."});
        return;
    }

    creditCards.splice(cardIndex, 1);
    res.status(204).send();
});




app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});

module.exports = app;