require('dotenv').config();
const express = require('express');
var cors = require('cors')
const rotas = require('./rotas');

const app = express();

app.use(cors())
app.use(express.json());
app.use(rotas);

module.exports = app
