const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const oneRoutes = require('../routes/oneRoutes');

app.use(express.json());
app.use(cookieParser());

app.use('/api/ones', oneRoutes);

module.exports = {
  app,
};
