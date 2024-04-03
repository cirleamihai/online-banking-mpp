const request = require("supertest");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

// Assuming you export your routes or app in a way they can be imported here
const creditCardsRoutes = require("../server.js");

app.use(creditCardsRoutes);

describe('Credit Cards API Endpoints', () => {
    let newCardId;

    it('should create a new credit card', async () => {
        const newCard = {
            card: {
                placeHolder: 'John Doe',
            },
        };

        const response = await request(app)
            .post('/api/v1/credit-cards')
            .send(newCard);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('placeHolder', 'John Doe');
        newCardId = response.body.id; // Saving for the later tests
    });

    it('should get all credit cards', async () => {
        const response = await request(app).get('/api/v1/credit-cards');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body.cards)).toBeTruthy();
        expect(response.body.cards.length).toBe(16);
    });

    it('should get a credit card by id', async () => {
        const response = await request(app).get(`/api/v1/credit-cards/${newCardId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.card).toHaveProperty('id', newCardId);
    });

    it('should update a credit card', async () => {
        const updatedCard = {
            card: {
                id: newCardId,
                placeHolder: 'Jane Doe',
            },
        };

        const response = await request(app)
            .put(`/api/v1/credit-cards/${newCardId}`)
            .send(updatedCard);

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Successfully updated');
    });

    it('should delete a credit card', async () => {
        const response = await request(app).delete(`/api/v1/credit-cards/${newCardId}`);
        expect(response.statusCode).toBe(204);

        const response2 = await request(app).get('/api/v1/credit-cards');
        expect(response2.body.cards.length).toBe(15)
    });
});
