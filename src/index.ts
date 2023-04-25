import dotenv from 'dotenv';
dotenv.config();

import { app } from './config/app';
import db from './config/db';
db();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
