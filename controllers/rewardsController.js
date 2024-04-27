const Point = require('../models/points');
const Reward = require('../models/rewards');

exports.redeemReward = async (req, res) => {
  try {
    const user = req.params.userId;
    const rewardId = req.params.rewardId;

    const userPoints = await Point.findOne({ user });
    const reward = await Reward.findById(rewardId);

    if (!userPoints || !reward) {
      return res.status(404).json({ message: 'User points or reward not found' });
    }

    if (userPoints.points < reward.pointsRequired) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    // Deduct points from user
    userPoints.points -= reward.pointsRequired;
    await userPoints.save();

    res.json({ message: 'Reward redeemed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
