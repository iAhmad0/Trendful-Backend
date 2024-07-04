const Admin = require("../models/admin");
const Seller = require("../models/seller");
const Buyer = require("../models/buyer");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllSellers = async (req, res) => {
  const sellers = await Seller.find().sort("createdAt");
  res.status(StatusCodes.OK).json({ sellers });
};

const updateSeller = async (req, res) => {
  if (!req.body) {
    throw new BadRequestError(" Data to update can not be empty.");
  }

  const seller = await Seller.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!seller) {
    throw new NotFoundError(`no seller with ${req.params.id} `);
  }
  res.status(StatusCodes.OK).json({ seller });
};

const deleteSeller = async (req, res) => {
  const seller = await Seller.findByIdAndRemove(req.params.id);
  if (!seller) {
    throw new NotFoundError(`no seller with ${req.params.id} `);
  }
  res.status(StatusCodes.OK).send("seller deleted successfully");
};

const getAllBuyers = async (req, res) => {
  const buyers = await Buyer.find().sort("createdAt");
  res.status(StatusCodes.OK).json({ buyers });
};

const updateBuyer = async (req, res) => {
  if (!req.body) {
    throw new BadRequestError(" Data to update can not be empty.");
  }

  const buyer = await Buyer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!buyer) {
    throw new NotFoundError(`no buyer with ${req.params.id} `);
  }
  res.status(StatusCodes.OK).json({ buyer });
};

const deleteBuyer = async (req, res) => {
  const buyer = await Buyer.findByIdAndRemove(req.params.id);
  if (!buyer) {
    throw new NotFoundError(`no buyer with ${req.params.id} `);
  }
  res.status(StatusCodes.OK).send("buyer deleted successfully");
};

// read products
const getAllProducts = async (req, res) => {
  const products = await Product.find().sort("createdAt");
  res.status(StatusCodes.OK).json({ products });
};

// delete product
const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);
  if (!product) {
    throw new NotFoundError(`no product with id ${req.params.id} `);
  }
  res.status(StatusCodes.OK).send("product deleted successfully");
};

module.exports = {
  getAllSellers,
  updateSeller,
  deleteSeller,
  getAllBuyers,
  updateBuyer,
  deleteBuyer,
  getAllProducts,
  deleteProduct,
};
