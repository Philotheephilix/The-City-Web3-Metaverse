const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;
let db;

const connectDB = async () => {
  try {
    const client = new MongoClient(mongoURI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    await client.connect();
    db = client.db('thoonga_nagaram');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

const getDB = () => db;

module.exports = { connectDB, getDB };
