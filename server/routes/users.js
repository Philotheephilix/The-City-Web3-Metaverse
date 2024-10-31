const express = require('express');
const router = express.Router();
const { getDB } = require('../db/db');

router.post('/users', async (req, res) => {
    const { username, anonid, role } = req.body;
    const newUser = { username, anonid, role };
    try {
        const db = getDB(); 
        const usersCollection = db.collection('users');
        const result = await usersCollection.updateOne(
            { anonid },
            { $set: newUser },
            { upsert: true }
        );
        if (result.upsertedCount > 0) {
            res.status(201).json({ _id: result.upsertedId, ...newUser });
        } else {
            res.status(200).json({ message: 'User updated', ...newUser });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
