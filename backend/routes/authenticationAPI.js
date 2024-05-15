// routes/userAPI.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const database = require('../database/databaseHandler');
const repo = require('../repository/repository');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({error: 'All fields are required'});
    }

    const newUser = new User({username, email});
    await newUser.setPassword(password);
    await database.addData('users', newUser);

    res.status(201).json({
        message: 'User registered successfully',
        user: newUser,
        token: jwt.sign({
            id: newUser.id,
            email: newUser.email,
            username: newUser.username
        }, process.env.JWT_SECRET, {expiresIn: '24h'})
    });
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required'});
    }

    const user = await repo.getUserByEmail(email) // Assuming email is unique
    if (!user.isTruthy() || !await user.validatePassword(password)) {
        return res.status(401).json({error: 'Invalid email or password'});
    }

    const token = jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, process.env.JWT_SECRET, {expiresIn: '24h'});
    res.json({
        token,
        user
    });
});


const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split('Bearer ')[1];
    if (!token) {
        return res.status(401).json({error: 'No token provided'});
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET); // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({error: 'Invalid token'});
    }
};

module.exports = {
    router,
    authMiddleware
}
