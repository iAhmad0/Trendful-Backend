const Order = require("../models/order");
const Seller = require("../models/seller");
const Buyer = require("../models/buyer");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const createOrder = async (req, res) => {
  const orderInfo = req.body;
  const verifyToken = jwt.verify(orderInfo[0], process.env.SECRET);

  if (verifyToken) {
    const order = {
      buyerID: verifyToken.buyerId,
      buyerInfo: { ...orderInfo[1] },
      products: [...orderInfo[2]],
      shipping: orderInfo[3],
      discount: orderInfo[4],
      totalPrice: orderInfo[5],
    };

    const createdOrder = await Order.create(order);

    for (let i = 0; i < orderInfo[2].length; i++) {
      const products = await Seller.findOne(
        { _id: orderInfo[2][i].sellerID },
        "products"
      );

      const product = products.products.filter(
        (elm) => elm._id == orderInfo[2][i].id
      )[0];

      product.quantity -= orderInfo[2][i].quantity;

      await Seller.updateOne(
        { _id: orderInfo[2][i].sellerID },
        {
          $set: {
            "products.$[x]": product,
          },
          $push: {
            orders: {
              _id: createdOrder,
              productID: orderInfo[2][i].id,
              quantity: orderInfo[2][i].quantity,
            },
          },
        },
        {
          arrayFilters: [
            {
              "x._id": product._id,
            },
          ],
        }
      );

      await Buyer.updateOne(
        { _id: verifyToken.buyerId },
        {
          $push: {
            orders: {
              _id: createdOrder,
              productID: orderInfo[2][i].id,
              quantity: orderInfo[2][i].quantity,
              points: orderInfo[2][i].quantity * orderInfo[2][i].price,
            },
          },
          $inc: {
            points: orderInfo[2][i].quantity * orderInfo[2][i].price,
          },
        }
      );
    }

    await Buyer.updateOne(
      { _id: verifyToken.buyerId },
      {
        $inc: {
          points: -order.discount * 100,
        },
      }
    );

    res.status(StatusCodes.OK).json("Success");
  } else {
    res.status(StatusCodes.BAD_REQUEST).json("Error");
  }
};

module.exports = {
  createOrder,
};
