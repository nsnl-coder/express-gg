import express from 'express';

const app = express();
import indexRouter from '../routers/index';

app.use(express.json());
app.use(indexRouter);

export { app };
