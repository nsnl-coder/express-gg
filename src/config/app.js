const express = require('express');

const app = express();
const oneRoutes = require('../routes/oneRoutes');

app.use(express.json());
app.use('/api/ones', oneRoutes);

module.exports = {
  app,
};
