const dotenv = require('dotenv');
dotenv.config();

const { app } = require('./config/app');
const db = require('./config/db');
db();

app.listen(3000, () => {
  console.log('App running on port 3000...');
});
