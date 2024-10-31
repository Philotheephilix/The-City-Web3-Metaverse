const express = require('express');
const router = express.Router();
const { getDB } = require('../db/db');

router.post('/energy', async (req, res) => {
    const energyData = req.body;
    try {
      const db = getDB();
      const energyCollection = db.collection('energy');
  
      const result = await energyCollection.insertOne(energyData);
      res.status(201).json({ _id: result.insertedId, ...energyData });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
router.get('/energy', async (req, res) => {
    try {
      const db = getDB();
      const energyCollection = db.collection('energy');
      const users = await energyCollection.find({}).toArray();
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  router.get('/energy/:id', async (req, res) => {
    const { id } = req.params; 
  
    try {
      const db = getDB();
      const energyCollection = db.collection('energy');
      const record = await energyCollection.findOne({ anonid: id });
  
      if (!record) {
        return res.status(404).json({ message: 'Record not found' });
      }
  
      res.status(200).json(record);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  module.exports = router; 