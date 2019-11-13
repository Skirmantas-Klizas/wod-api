const express = require('express');
const router = express.Router();
const adminCheckAuth = require('../middleware/admin-check-auth');
const wodsController = require('../controllers/wodsController');

router.post('/', adminCheckAuth.auth, wodsController.postWod);
router.get('/', wodsController.getAllWods);
router.get('/:wodId', wodsController.getWod);
router.patch('/:wodId', adminCheckAuth.auth, wodsController.updateWod);
router.delete('/:wodId', adminCheckAuth.auth, wodsController.deleteWod);

module.exports = router;
