const express = require('express');
const router = express.Router();
const { getDB } = require('../db/db');

router.post('/med', async (req, res) => {
    const medData = req.body;
    try {
      const db = getDB();
      const medCollection = db.collection('med');
  
      const result = await medCollection.insertOne(medData);
      res.status(201).json({ _id: result.insertedId, ...medData });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  router.post('/medi', async (req, res) => {
    const { anonid } = req.body;
    try {
        console.log(anonid)
        const db = getDB();
        const medCollection = db.collection('med');
        const records = await medCollection.find({ userId: anonid }).toArray();
        if (records.length === 0) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.status(200).json(records);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

  
  module.exports = router; 