const Point = require('../models/points');
const {Order} = require('../models/order');

const getUserPoints = async (req, res) => {
  try {
    const user = req.params.userId;
    const userPoints = await Point.findOne({ user });
    if (!userPoints) {
      return res.status(404).json({ message: 'User points not found' });
    }
    res.json(userPoints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const createPoints = async (req, res) => {
    try {
      const user = req.params.userId;
  
      // Check if the order was done 14 days ago and not cancelled
      const order = await Order.findOne({ user, status: 'completed' })
                               .sort({ 'dateOrdered': -1 });

      if (!order || order.dateOrdered > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)) {
        return res.status(400).json({ message: 'No eligible order found' });
      }
  
      // Calculate points based on the cost of the order
      const pointsToAdd = Math.floor(order.totalPrice / 20);
 
      // Add points to user
      let userPoints = await Point.findOne({ user});
      if (!userPoints) {
        userPoints = new Point({ user, points: 0 });
      }
  
      // Add points to user
      userPoints.points += pointsToAdd;
      await userPoints.save();
  
      res.json({ message: 'Points added successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  

module.exports = {
    getUserPoints,
    createPoints,

};