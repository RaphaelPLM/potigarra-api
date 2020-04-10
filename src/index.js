const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(port, () => console.log('Listening on port ', port));
