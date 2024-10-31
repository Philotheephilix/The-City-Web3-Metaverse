const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
let db;

async function connectToDB() {
  try {
    await client.connect();
    db = client.db('thoonga_nagaram');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

function getDB() {
  return db;
}

module.exports = {
  connectToDB,
  getDB,
};
