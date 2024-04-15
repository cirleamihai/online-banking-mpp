const express = require("express");
const cors = require("cors");
const app = express();
const creditCards = require("./localStorage.js");
const CreditCard = require("./cardModel.js");
const generateRandomCreditCard = require("./randomDataGenerator.js");
const {v4: uuidv4} = require('uuid');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

function generateAndAddCreditCards() {
    const newCards = Array.from({ length: 20 }, () => generateRandomCreditCard());
    newCards.forEach((card) => creditCards.push(card));

    // Notify all connected clients that new data is available
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('update'); // Simple message indicating data has been updated
        }
    });
}
// Set interval to generate new credit cards every 10 seconds
setInterval(generateAndAddCreditCards, 10000);

// WebSocket connection handler
wss.on('connection', function connection(ws) {
    console.log('Client connected');
    ws.on('message', function incoming(message) {
        console.log('Received message: %s', message);
    });
});


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

app.get('/health', (req, res) => {
    res.status(200).send('OK');
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