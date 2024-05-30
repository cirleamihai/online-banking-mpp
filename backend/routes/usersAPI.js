const express = require("express");
const router = express.Router();
const database = require("../database/databaseHandler.js");
const repo = require("../repository/repository.js");
const User = require("../models/userModel.js");

router.get("/", async (req, res) => {
    const users = await repo.getUsers();
    if (! users) {
        return res.status(403).json({error: "Unauthorized access"});
    }
    res.json({users});
});

// add a new user
router.post("/", async (req, res) => {
    const user = req.body.user;
    if (!user) {
        return res.status(400).json({error: "User details not provided"});
    }

    const newUser = new User(user);
    await newUser.setPassword(user.password);
    await database.addData('users', newUser);
    res.status(201).json({message: "User registered successfully", user: newUser});
})


router.put("/:user_id", async (req, res) => {
    const user = await repo.getUserByID(req.params.user_id);
    if (! user) {
        return res.status(404).json({error: "User not found"});
    }

    await user.updateContents(req.body.user);
    console.log(user)

    database.updateData('users', user).then(() => {
        res.json({message: `Successfully updated ${user.username}'s details`});
    });
});

router.delete("/:user_id", async (req, res) => {
    const user = await repo.getUserByID(req.params.user_id);
    if (! user) {
        return res.status(404).json({error: "User not found"});
    }

    database.deleteDataProcedure('deleteUser', user.id).then(() => {
        res.json({message: `Successfully deleted ${user.username}'s account`});
    });
});

module.exports = router;