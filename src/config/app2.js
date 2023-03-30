const express = require('express');

const app = express();
const indexRouter = require('../routes/index');

app.use(express.json());
app.use(indexRouter);

module.exports = {
  app,
};
