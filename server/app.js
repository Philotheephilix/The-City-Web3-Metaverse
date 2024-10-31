const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const { connectToDB } = require('./db/db');

app.use(cors());

app.use(express.json());

connectToDB();
const usersRouter = require('./routes/users');
const patrolRouter = require('./routes/patrol');
const medRouter = require('./routes/medical');
const energyRouter = require('./routes/energy');

app.use('/', usersRouter);
app.use('/', patrolRouter);
app.use('/', medRouter);
app.use('/', energyRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
