const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const repo = require('./repository/repository.js');

// Using the express framework
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware for parsing JSON and enabling CORS
app.use(cors());
app.use(express.json());

// Including the Authentication routes
// Checking the token for all routes starting with /api/v1/

// Including the routes
const creditCardsRouter = require('./routes/creditCardsAPI.js');
const purchasesRouter = require('./routes/purchasesAPI.js');
const authentication = require('./routes/authenticationAPI.js');
const usersRouter = require('./routes/usersAPI.js');

// Using the routes
app.use('/api/v1/auth', authentication.router);
app.use('/api/v1/users', authentication.adminMiddleware, usersRouter);
app.use('/api/v1/credit-cards', authentication.authMiddleware, creditCardsRouter);
app.use('/api/v1/purchases', authentication.authMiddleware, purchasesRouter);

function sendSocketUpdates() {
    // Notify all connected clients that new data is available
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('update'); // Simple message indicating data has been updated
        }
    });
}
// GOLD TASK FOR ASSIGNMENT 2
// setInterval(sendSocketUpdates, 10000);

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