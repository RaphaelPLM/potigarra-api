const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const { errors } = require('celebrate')

const app = express();

const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errors())

app.listen(port, () => console.log('Listening on port ', port));
