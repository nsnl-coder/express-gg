const mongoose = require('mongoose');

const db = () => {
  if (!process.env.CONNECTION_STRING) {
    return console.log('Add mongodb connection string to .env file to connect');
  }

  mongoose
    .connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Mongodb Database Connected');
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = db;
