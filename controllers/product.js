const { StatusCodes } = require("http-status-codes");
const Product = require("../models/product");

const getAllProducts = async (req, res) => {
  const products = await Product.find();

  res.status(StatusCodes.OK).json(products);
};

const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  const { images, description, name, price, quantity } = product;

  let hasStock = false;

  if (quantity > 0) {
    hasStock = true;
  }

  const info = {
    images: images,
    description: description,
    name: name,
    price: price,
    stock: hasStock,
  };

  res.status(StatusCodes.OK).json(info);
};

const searchProduct = async (req, res) => {
  let products = [];
  let counter = 0;
  let extra = [];
  const allProducts = await Product.find();

  for (let i = 0; i < allProducts.length; i++) {
    if (allProducts[i].name === req.body.search.toLowerCase()) {
      products.push(allProducts[i]);
      counter++;
    } else if (
      allProducts[i].name[0].toLowerCase() === req.body.search[0].toLowerCase()
    ) {
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
