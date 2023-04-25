import express from "express";;

const app = express();
import indexRouter from "../routes/index.js";;

app.use(express.json());
app.use(indexRouter);

export {
  app,
};
