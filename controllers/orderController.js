const Order = require("../models/order");
const Seller = require("../models/seller");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const order = async (req, res) => {
  const orderInfo = req.body;
  const verifyToken = jwt.verify(orderInfo[0], process.env.SECRET);

  if (verifyToken) {
    const order = {
      ...orderInfo[1],
      products: [...orderInfo[2]],
      totalPrice: orderInfo[3],
    };

    const createdOrder = await Order.create(order);

    const sellers = await Seller.find();

    for (let k = 0; k < orderInfo[2].length; k++) {
      for (let i = 0; i < sellers.length; i++) {
        const products = sellers[i].products;

        for (let j = 0; j < products.length; j++) {
          if (products[j]._id == orderInfo[2][k].id) {
            const product = products[j];
            product.quantity -= orderInfo[2][k].quantity;

            await Seller.updateOne(
              { _id: sellers[i]._id },
              {
                $set: {
                  "products.$[x]": product,
                },
                $push: {
                  order: {
                    _id: createdOrder,
                    productID: order.id,
                    quantity: order.quantity,
                  },
                },
              },
              {
                arrayFilters: [
                  {
                    "x._id": product.id,
                  },
                ],
              }
            );

            break;
          }
        }
      }
    }

    res.status(StatusCodes.OK).json("Success");
  } else {
    res.status(StatusCodes.BAD_REQUEST).json("Error");
  }
};

const createOrder = async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );
  const orderItemsIdsResolved = await orderItemsIds;

  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });
  order = await order.save();

  if (!order) return res.status(400).send("the order cannot be created!");

  res.send(order);
};

const getOrders = async (req, res) => {
  const orderList = await Order.find()
    .populate("buyer", "name")
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
};

const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("buyer", "name")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
};
const updateOrder = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  if (!order) return res.status(400).send("the order cannot be update!");

  res.send(order);
};

const deleteOrder = (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "the order is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "order not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
};

module.exports = {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  order,
};
