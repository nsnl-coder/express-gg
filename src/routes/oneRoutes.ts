import express from 'express';
import { validateRequest, requiredFields } from 'yup-schemas';
import { requireLogin, requireRole } from 'express-common-middlewares';
//
import oneSchema from '../yup/oneSchema';
import * as oneController from '../controllers/oneController';
import { User } from '../models/userModel';

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

export default router;
