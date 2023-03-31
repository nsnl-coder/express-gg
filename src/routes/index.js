const express = require('express');

const router = express.Router();

// #insert__routers

router.use('/', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message:
      'Congrats! You need to run "gg" command next to create new resource',
  });
});

module.exports = router;
