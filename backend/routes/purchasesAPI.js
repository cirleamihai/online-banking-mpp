const express = require("express");
const router = express.Router();
const Purchase = require("../models/purchasesModel.js");
const database = require("../database/databaseHandler.js");
const repo = require("../repository/repository.js");

router.get("/purchases", async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || -1;
    const offset = (page - 1) * limit;

    const purchases = await repo.getPurchases(offset, limit);
    res.json({purchases: purchases});
});

router.get("/purchases/:id", async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({error: "Purchase ID not provided."});
        return;
    }

    const purchase = await repo.getPurchaseByID(req.params.id);
    if (!purchase.isTruthy()) {
        res.status(404).json({error: "Purchase not found."});
        return;
    }

    res.json({purchase: purchase});
});

// Add a new purchase
router.post('/purchases', (req, res) => {
    const purchase = req.body.purchase;
    if (!purchase) {
        res.status(400).json({error: "Purchase details not provided."});
        return;
    }

    const newPurchase = new Purchase(purchase);
    database.addData('purchases', newPurchase).then(() => {
        res.status(201).json(newPurchase);
    });
});


// Delete an existing purchase
router.delete('/purchases/:id', async (req, res) => {
    const purchases = await repo.getPurchaseByID(req.params.id);
    if (!purchases.isTruthy()) {
        res.status(404).json({error: "Purchase not found."});
        return;
    }

    database.deleteData('purchases', purchases, req.params.id).then(() => {
        res.status(204).send();
    });
});

module.exports = router;