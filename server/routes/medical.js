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


  router.get('/med/:id', async (req, res) => {
    const { id } = req.params; 
  
    try {
      const db = getDB();
      const medCollection = db.collection('med');
      const record = await medCollection.findOne({ anonid: id }); 
  
      if (!record) {
        return res.status(404).json({ message: 'Record not found' });
      }
  
      res.status(200).json(record);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  module.exports = router; 