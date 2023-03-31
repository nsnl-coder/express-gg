const dotenv = require('dotenv');
dotenv.config();

const { app } = require('./config/app');
const db = require('./config/db');
db();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
