import express, { NextFunction, Request, Response } from 'express';

const router = express.Router();

// #insert__routers

router.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: 'success',
    message:
      'Congrats! You need to run "gg" command next to create new resource',
  });
});

export default router;
