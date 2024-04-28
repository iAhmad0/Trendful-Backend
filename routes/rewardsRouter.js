const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardsController');

router.post('/redeem/:userId/:rewardId', rewardController.redeemReward);

module.exports = router;
