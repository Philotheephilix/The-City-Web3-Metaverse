const express = require('express');
const cors = require('cors');
const app = express();
const { connectDB } = require('../db/db');

app.use(cors());

app.use(express.json());

const usersRouter = require('../routes/users');
const patrolRouter = require('../routes/patrol');
const medRouter = require('../routes/medical');
const energyRouter = require('../routes/energy');

app.use('/', usersRouter);
app.use('/', patrolRouter);
app.use('/', medRouter);
app.use('/', energyRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});
const startServer = async () => {
    await connectDB(); 
  };
startServer();
module.exports = (req, res) => {
    app(req, res);
};
