const express = require("express");

const app = express();

app.use(express.json());

console.log(process.env.DEVELOPMENT_DATABASE_USER)

app.listen(8000);