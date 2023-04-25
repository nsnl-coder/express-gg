import dotenv from "dotenv";;
dotenv.config();

import { app } from "./config/app.js";;
import db from "./config/db.js";;
db();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
