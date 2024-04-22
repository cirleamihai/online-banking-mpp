const express = require("express");
const router = express.Router();
const Purchase = require("../models/purchasesModel");
const database = require("../database/databaseHandler");
router.get("/purchases", (req, res) => {
    loadData().then(() => {
        res.json({purchases: purchases});
    });
});

router.get("/purchases/:id", (req, res) => {
    if (!req.params.id) {
        res.status(400).json({error: "Purchase ID not provided."});
        return;
    }

    const purchase = purchases.find((purchase) => purchase.id === req.params.id);
    if (purchase == null) {
        res.status(404).json({error: "Purchase not found."});
        return;
    }

    res.json({purchase: purchase});
});

router.put("/purchases/:id", (req, res) => {
    const purchaseIndex = purchases.findIndex((purchase) => purchase.id === req.params.id);

    if (purchaseIndex === -1) {
        res.status(404).json({error: "Purchase not found."});
        return;
    }

    purchases[purchaseIndex] = new Purchase(req.body.purchase);
    database.updateData('purchases', purchases[purchaseIndex]).then(() => {
        res.json(`Successfully updated the purchase with ID: ${purchases[purchaseIndex].id}`);
    });

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
        purchases.push(newPurchase);
        res.status(201).json(newPurchase);
    });
});


// Delete an existing purchase
router.delete('/purchases/:id', (req, res) => {
    const purchaseIndex = purchases.findIndex((purchase) => purchase.id === req.params.id);
    if (purchaseIndex === -1) {
        res.status(404).json({error: "Purchase not found."});
        return;
    }

    database.deleteData('purchases', purchases[purchaseIndex]).then(() => {
        purchases.splice(purchaseIndex, 1);
        res.status(204).send();
    });
});