import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
import indexRouter from '../routers/index';

app.use(express.json());
app.use(cookieParser());

app.use('/', indexRouter);

export { app };
