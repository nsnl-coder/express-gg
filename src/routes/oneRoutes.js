const express = require('express');
const { validateRequest, requiredFields } = require('yup-schemas');
const { requireLogin, requireRole } = require('express-common-middlewares');
//
const oneSchema = require('../yup/oneSchema');
const oneController = require('../controllers/oneController');
const { User } = require('../models/userModel');

const router = express.Router();

// TODO: apply 2 below middlewares to correct place
router.use(requireLogin(User));
router.use(requireRole('admin'));

router.get('/:id', validateRequest(oneSchema), oneController.getOne);
router.get('/', validateRequest(oneSchema), oneController.getManyOnes);

router.post(
  '/',
  // TODO: FIX THIS REQUIRED FIELD
  // requiredFields('edit-this'),
  validateRequest(oneSchema),
  oneController.createOne,
);

router.put('/:id', validateRequest(oneSchema), oneController.updateOne);
router.put('/', validateRequest(oneSchema), oneController.updateManyOnes);

router.delete('/:id', validateRequest(oneSchema), oneController.deleteOne);
router.delete('/', validateRequest(oneSchema), oneController.deleteManyOnes);

module.exports = router;
