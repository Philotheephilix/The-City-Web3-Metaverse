const express = require('express');
const router = express.Router();
const { getDB } = require('../db/db');

router.post('/crime', async (req, res) => {
    const crimeData = req.body;
    try {
      const db = getDB();
      const patrolCollection = db.collection('crime');
  
      const result = await patrolCollection.insertOne(crimeData);
      res.status(201).json({ _id: result.insertedId, ...crimeData });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  router.get('/crime', async (req, res) => {
    try {
      const db = getDB();
      const crimeCollection = db.collection('crime');
      const crimeTypesCollection = db.collection('crime_types');
  
      const [crimeData, crimeTypes] = await Promise.all([
        crimeCollection.find({}).toArray(),
        crimeTypesCollection.find({}).toArray()
      ]);
  
      res.status(200).json({
        crimeData,
        crimeTypes
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  router.get('/crime/:id', async (req, res) => {
    const { id } = req.params; 
  
    try {
      const db = getDB();
      const patrolCollection = db.collection('patrol');
      const record = await patrolCollection.findOne({ anonid: id });
  
      if (!record) {
        return res.status(404).json({ message: 'Record not found' });
      }
  
      res.status(200).json(record);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  module.exports = router; 