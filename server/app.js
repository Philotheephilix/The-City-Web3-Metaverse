const express = require('express');
const app = express();
const port = 3000;
const { connectToDB } = require('./db/db');

app.use(express.json());


connectToDB();
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/patrol');

app.use('/', usersRouter);
app.use('/', productsRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
