const Seller = require("../models/seller");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");
const path = require("path");

const allProducts = [];

const fetchProducts = async () => {
  const sellers = await Seller.find();
  sellers.forEach((elm) => {
    if (elm.products.length) {
      allProducts.push(...elm.products);
    }
  });
};

fetchProducts();

const getAllProducts = async (req, res) => {
  if (allProducts.length) {
    res.status(StatusCodes.OK).json(allProducts);
  } else {
    res.status(StatusCodes.CONFLICT);
  }
};

const getProduct = async (req, res) => {
  const [product] = allProducts.filter((elm) => elm._id == req.params.id);

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

const addProduct = async (req, res) => {
  const verifyToken = jwt.verify(req.body.token, process.env.SECRET);

  if (verifyToken) {
    const { name, description, price, quantity, category } = req.body;
    let images = [];

    for (let i = 0; i < req.files.length; i++) {
      images.push(req.files[i].filename);
    }
    if (
      name != "" &&
      description != "" &&
      images.length &&
      price != 0 &&
      quantity != 0 &&
      category != ""
    ) {
      await Seller.findByIdAndUpdate(verifyToken.sellerId, {
        $push: {
          products: [
            {
              name: name,
              description: description,
              images: images,
              price: price,
              quantity: quantity,
              category: category,
            },
          ],
        },
      });

      const seller = await Seller.findById(verifyToken.sellerId);
      const product = seller.products;

      allProducts.push({
        _id: product[product.length - 1]._id,
        name: name,
        description: description,
        images: images,
        price: price,
        quantity: quantity,
        category: category,
      });

      res.status(StatusCodes.OK).json("Successful");
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json("Please fill in all the fields.");
    }
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
const getSellerProducts = async (req, res) => {
  const verifyToken = jwt.verify(req.params.id, process.env.SECRET);
  if (verifyToken) {
    const seller = await Seller.findById(verifyToken.sellerId);
    res.status(StatusCodes.OK).json(seller.products);
  } else {
    res.status(StatusCodes.NOT_ACCEPTABLE).json("Please log in again.");
  }
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

module.exports = {
  loginSeller,
  signupSeller,
  checkToken,
  getSellerInfo,
  updateSellerInfo,
  updateSellerPassword,
  getSellerProducts,
  updateProduct,
  deleteProduct,
  addProduct,
  getProductImage,
  getAllProducts,
  getProduct,
};
