const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");

const getAllProducts = async (req, res) => {
  const products = await Product.find();

  res.status(StatusCodes.OK).json(products);
};

const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  res.status(StatusCodes.OK).json(product);
};

const searchProduct = async (req, res) => {
  let products = [];
  let counter = 0;
  let extra = [];
  const allProducts = await Product.find();

  for (let i = 0; i < allProducts.length; i++) {
    if (allProducts[i].name === req.body.search) {
      products.push(allProducts[i]);
      counter++;
    } else if (allProducts[i].name[0] === req.body.search[0]) {
      extra.push(allProducts[i]);
    }
  }

  if (counter < 2) {
    res.status(StatusCodes.OK).json(extra.concat(products));
  } else {
    res.status(StatusCodes.OK).json(products);
  }
};

module.exports = { getAllProducts, getProduct, searchProduct };
