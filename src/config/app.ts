import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
import oneRoutes from '../routes/oneRoutes';

app.use(express.json());
app.use(cookieParser());

app.use('/api/ones', oneRoutes);

export { app };
