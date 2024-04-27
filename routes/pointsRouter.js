const express = require('express');
const router = express.Router();
const pointController = require('../controllers/pointsController');

router.get('/get/:userId', pointController.getUserPoints);
router.post('/:userId', pointController.createPoints);
module.exports = router;
