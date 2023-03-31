const express = require('express');

const router = express.Router();

// #insert__routers

router.use('/', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: 'The route you access is not defined',
  });
});

module.exports = router;
