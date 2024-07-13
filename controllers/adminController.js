const Admin = require("../models/admin");
const Seller = require("../models/seller");
const Buyer = require("../models/buyer");
const Home = require("../models/homeproduct");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

let homeProducts = [];

const fetchHomeProducts = async () => {
  homeProducts = await Home.find();
};

fetchHomeProducts();

const addHomeProduct = async (req, res) => {
  const count = await Home.find();

  if (count.length < 6) {
    const product = await Home.create({ productID: req.body.id });
    homeProducts.push(product);

    res.status(StatusCodes.OK).json("Success");
  } else {
    res.status(StatusCodes.BAD_REQUEST).json("Maximum products reached!");
  }
};

const removeHomeProduct = async (req, res) => {
  await Home.findOneAndDelete({ productID: req.body.id });

  homeProducts = homeProducts.filter(
    (product) => product.productID != req.body.id
  );

  res.status(StatusCodes.OK).json("Success");
};

const getHomeProducts = async (req, res) => {
  res.status(StatusCodes.OK).json(homeProducts);
};

const getAllSellers = async (req, res) => {
  const sellers = await Seller.find({}, { name: 1, email: 1 });
  res.status(StatusCodes.OK).json(sellers);
};

const editSeller = async (req, res) => {
  try {
    await Seller.findOneAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
        },
      }
    );

    res.status(StatusCodes.OK).json("Success");
  } catch (err) {
    res.status(StatusCodes.CONFLICT).json("Try another email");
  }
};

const deleteSeller = async (req, res) => {
  await Seller.findOneAndDelete({ _id: req.params.id });

  res.status(StatusCodes.OK).json("Success");
};

const getAllBuyers = async (req, res) => {
  const buyers = await Buyer.find({}, { name: 1, email: 1 });
  res.status(StatusCodes.OK).json(buyers);
};

const editBuyer = async (req, res) => {
  try {
    await Buyer.findOneAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
        },
      }
    );

    res.status(StatusCodes.OK).json("Success");
  } catch (err) {
    res.status(StatusCodes.CONFLICT).json("Try another email");
  }
};

const deleteBuyer = async (req, res) => {
  await Buyer.findOneAndDelete({ _id: req.params.id });

  res.status(StatusCodes.OK).json("Success");
};

// read products
const getAllProducts = async (req, res) => {
  const products = await Product.find().sort("createdAt");
  res.status(StatusCodes.OK).json({ products });
};

const getBuyer = async (req, res) => {
  const buyer = await Buyer.findOne(
    { _id: req.params.id },
    { name: 1, email: 1 }
  );

  res.status(StatusCodes.OK).json(buyer);
};

module.exports = {
  getAllSellers,
  editSeller,
  deleteSeller,
  getAllBuyers,
  editBuyer,
  deleteBuyer,
  getAllProducts,
  addHomeProduct,
  removeHomeProduct,
  getHomeProducts,
  getBuyer,
};
