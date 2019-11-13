const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkExisting = require('../middleware/check-existing');
const responsesController = require('../controllers/responsesController');

router.get('/', responsesController.getAllResponses);
router.post(
    '/',
    checkAuth.auth,
    checkExisting.existingWod,
    responsesController.postResponse
);
router.get('/:responseId', responsesController.getResponse);
router.patch(
    '/:responseId',
    checkAuth.auth,
    responsesController.updateResponse
);
router.delete(
    '/:responseId',
    checkAuth.auth,
    responsesController.deleteResponse
);

module.exports = router;
