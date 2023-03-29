const express = require('express');
const { validateRequest, requiredFields } = require('yup-schemas');
// const requireLogin = require('../middlewares/requireLogin')
// const requireRole = require('../middlewares/requireRole')

const oneSchema = require('../yup/oneSchema');
const oneController = require('../controllers/oneController');

const router = express.Router();

// TODO: apply middlewares to restrict routes
// TODO: add requiredFields middleware for createOne route if needed
// router.use(requireLogin)
// route.use(requireRole)
// requiredFields('')

router.post('/', validateRequest(oneSchema), oneController.createOne);

router.get('/:id', validateRequest(oneSchema), oneController.getOne);
router.get('/', validateRequest(oneSchema), oneController.getManyOnes);

router.put('/:id', validateRequest(oneSchema), oneController.updateOne);
router.put('/', validateRequest(oneSchema), oneController.updateManyOnes);

router.delete('/:id', validateRequest(oneSchema), oneController.deleteOne);
router.delete('/', validateRequest(oneSchema), oneController.deleteManyOnes);

module.exports = router;
