const express = require('express');
const { validateRequest } = require('yup-schemas');
const oneController = require('../controllers/oneController');
const oneSchema = require('../yup/oneSchema');
const router = express.Router();

router.post('/', validateRequest(oneSchema), oneController.createOne);

router.get('/:id', validateRequest(oneSchema), oneController.getOne);
router.get('/', oneController.getAllOnes);

router.put('/:id', validateRequest(oneSchema), oneController.updateOne);
router.put('/', validateRequest(oneSchema), oneController.updateManyOnes);
router.delete('/:id', validateRequest(oneSchema), oneController.deleteOne);
router.delete('/', validateRequest(oneSchema), oneController.deleteManyOnes);

module.exports = router;
