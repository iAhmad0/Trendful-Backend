const Seller = require("../models/seller");
const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");
const path = require("path");

// login Seller
const loginSeller = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("please provide email and password");
  }

  const seller = await Seller.findOne({ email });
  if (!seller) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await seller.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = seller.createJWT();
  res
    .status(StatusCodes.OK)
    .json({ name: seller.name, token, successful: true });
};

// signup seller
const signupSeller = async (req, res) => {
  const seller = await Seller.create({ ...req.body });

  const token = seller.createJWT();

  res.status(StatusCodes.CREATED).json({ name: seller.name, token });
};

// check for token
const checkToken = async (req, res) => {
  try {
    const verifyToken = jwt.verify(req.body.token, process.env.SECRET);

    if (verifyToken) {
      res.status(StatusCodes.OK).json({ valid: true, name: verifyToken.name });
    }
  } catch (err) {
    res.status(StatusCodes.FORBIDDEN).json({ valid: false });
  }
};

const getSellerInfo = async (req, res) => {
  try {
    const verifyToken = jwt.verify(req.body.token, process.env.SECRET);
    if (verifyToken) {
      const seller = await Seller.findById(verifyToken.sellerId);

      res.status(StatusCodes.OK).json({
        valid: true,
        name: seller.name,
        email: seller.email,
      });
    }
  } catch (err) {
    res.status(StatusCodes.FORBIDDEN).json({ valid: false });
  }
};

const updateSellerInfo = async (req, res) => {
  try {
    const verifyToken = jwt.verify(req.body.token, process.env.SECRET);
    if (verifyToken) {
      const { newName, newEmail, newMobile } = req.body;
      const seller = await Seller.findByIdAndUpdate(verifyToken.sellerId, {
        name: newName,
        email: newEmail,
        mobile: newMobile,
      });
    }
  } catch (err) {
    res.status(StatusCodes.FORBIDDEN).json({ valid: false });
  }
};

const updateSellerPassword = async (req, res) => {
  try {
    const verifyToken = jwt.verify(req.body.token, process.env.SECRET);
    if (verifyToken) {
      const { currentPassword, newPassword } = req.body;

      const seller = await Seller.findById(verifyToken.sellerId);
      const isPasswordCorrect = await seller.comparePassword(currentPassword);
      if (isPasswordCorrect) {
        await Seller.findByIdAndUpdate(verifyToken.sellerId, {
          password: newPassword,
        });
      }
    }
  } catch (err) {
    res.status(StatusCodes.FORBIDDEN).json({ valid: false });
  }
};

// create product
const createProduct = async (req, res) => {
  const newProduct = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({
    status: "success",
    data: {
      product: newProduct,
    },
  });
};

const addProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, category } = req.body;
    let images = [];

    for (let i = 0; i < req.files.length; i++) {
      images.push(req.files[i].filename);
    }

    if (!req.files) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json("Please fill in all the fields.");
    }

    const user = await Product.create({
      name,
      description,
      images,
      price,
      quantity,
      category,
    });

    res.status(StatusCodes.OK).json("Successful");
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json("Please fill in all the fields.");
  }
};

const getProductImage = async (req, res) => {
  try {
    const image = path.dirname(__dirname) + "\\uploads\\" + req.params.id;
    res.status(StatusCodes.OK).sendFile(image);
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json({ message: "Resource not found!" });
  }
};

// read products
const getAllProducts = async (req, res) => {
  const products = await Product.find().sort("createdAt");
  res.status(StatusCodes.OK).json({ products });
};

// update product
const updateProduct = async (req, res) => {
  if (!req.body) {
    throw new BadRequestError(" Data to update can not be empty.");
  }
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new NotFoundError(`no product with id ${req.params.id} `);
  }
  res.status(StatusCodes.OK).json({ product });
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
  loginSeller,
  signupSeller,
  checkToken,
  getSellerInfo,
  updateSellerInfo,
  updateSellerPassword,
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addProduct,
  getProductImage,
};
