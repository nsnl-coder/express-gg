import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
import oneRouter from '../routers/oneRouter';

app.use(express.json());
app.use(cookieParser());

app.use('/api/ones', oneRouter);

export { app };
