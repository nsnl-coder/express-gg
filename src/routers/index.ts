import express, { NextFunction, Request, Response } from 'express';
// #insert__routers
import oneRouter from './oneRouter';

const router = express.Router();

// #use__routers
router.use('/api/ones', oneRouter);

router.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: 'success',
    message:
      'Congrats! You need to run "gg" command next to create new resource',
  });
});

export default router;
