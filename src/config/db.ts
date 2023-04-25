import mongoose from 'mongoose';

const db = () => {
  if (!process.env.CONNECTION_STRING) {
    return console.log('Add mongodb connection string to .env file to connect');
  }

  mongoose
    .connect(process.env.CONNECTION_STRING)
    .then(() => {
      console.log('Mongodb Database Connected');
    })
    .catch((error) => {
      console.log(error);
    });
};

export default db;
