const Purchase = require('./models/purchasesModel.js');
const CreditCard = require("./models/cardModel.js");
const generateRandomCreditCard = require("./controller/randomDataGenerator.js");
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const database = require('./database/databaseHandler.js');
const repo = require('./repository/repository.js');

// Using the express framework
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware for parsing JSON and enabling CORS
app.use(cors());
app.use(express.json());

// Including the routes
const creditCardsRouter = require('./routes/creditCards.js');
const purchasesRouter = require('./routes/purchases.js');

// Using the routes
app.use('/api/v1/', creditCardsRouter);
app.use('/api/v1/', purchasesRouter);

let creditCards = [];
let purchases = [];

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
// GOLD TASK FOR ASSIGNMENT 2
// setInterval(generateAndAddCreditCards, 10000);

repo.loadData().then(() => {
    console.log('Data loaded successfully');
});

// WebSocket connection handler
wss.on('connection', function connection(ws) {
    console.log('Client connected');
    ws.on('message', function incoming(message) {
        console.log('Received message: %s', message);
    });
});


// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});

module.exports = app;