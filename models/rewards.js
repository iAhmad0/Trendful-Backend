const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  pointsRequired: {
    type: Number,
    required: true
  },
  rewardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reward',
    required: true
  },
});

const Reward = mongoose.model('Reward', rewardSchema);

module.exports = Reward;
