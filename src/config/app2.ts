import express from 'express';

const app = express();
import indexRouter from '../routes/index';

app.use(express.json());
app.use(indexRouter);

export { app };
