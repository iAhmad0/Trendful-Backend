const Seller = require("../models/seller");
const Order = require("../models/order");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");
const path = require("path");

let allProducts = [];

const fetchProducts = async () => {
  allProducts = [];
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
    id: req.params.id,
    name: name,
    description: description,
    price: price,
    stock: hasStock,
    images: images,
  };

  res.status(StatusCodes.OK).json(info);
};

const getProductInfo = async (req, res) => {
  const [product] = allProducts.filter((elm) => elm._id == req.params.id);

  const { name, description, price, quantity, category, images } = product;

  const info = {
    name: name,
    description: description,
    price: price,
    quantity: quantity,
    category: category,
    images: images,
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

      await Seller.updateOne(
        { _id: verifyToken.sellerId },
        {
          $set: {
            name: newName,
            email: newEmail,
            mobile: newMobile,
          },
        }
      );
    }

    res.status(StatusCodes.CREATED).json("Success");
  } catch (err) {
    res.status(StatusCodes.CONFLICT).json("Email already exists!");
  }
};

const updateSellerPassword = async (req, res) => {
  try {
    const verifyToken = jwt.verify(req.body.token, process.env.SECRET);

    if (verifyToken) {
      const { currentPassword, newPassword } = req.body;

      const seller = await Seller.findById(verifyToken.sellerId);
      const isPasswordCorrect = await buyer.comparePassword(currentPassword);

      if (isPasswordCorrect) {
        await Seller.findByIdAndUpdate(verifyToken.sellerId, {
          password: newPassword,
        });
      } else {
        res.status(StatusCodes.FORBIDDEN).json("Your password is wrong");
      }
    }
  } catch (err) {
    res.status(StatusCodes.FORBIDDEN).json("Your password is wrong");
  }
};

const addProduct = async (req, res) => {
  const verifyToken = jwt.verify(req.body.token, process.env.SECRET);

  if (verifyToken) {
    const { name, description, price, quantity, category } = req.body;
    const images = [];

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
    res.status(StatusCodes.NOT_ACCEPTABLE).json("Please log in.");
  }
};

// update product
const updateProduct = async (req, res) => {
  const verifyToken = jwt.verify(req.body.token, process.env.SECRET);

  if (verifyToken) {
    const { name, description, price, quantity, category } = req.body;
    const images = [];

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
      await Seller.updateOne(
        { _id: verifyToken.sellerId },
        {
          $set: {
            "products.$[x]": {
              _id: req.params.id,
              name: name,
              description: description,
              images: images,
              price: price,
              quantity: quantity,
              category: category,
            },
          },
        },
        {
          arrayFilters: [
            {
              "x._id": req.params.id,
            },
          ],
        }
      );

      const seller = await Seller.findById(verifyToken.sellerId);
      const product = seller.products;

      allProducts = allProducts.filter((elm) => elm._id != req.params.id);
      allProducts.push(...product.filter((elm) => elm._id == req.params.id));

      res.status(StatusCodes.OK).json("Successful");
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json("Please fill in all the fields.");
    }
  }
};

// delete product
const deleteProduct = async (req, res) => {
  const verifyToken = jwt.verify(req.params.token, process.env.SECRET);

  if (verifyToken) {
    await Seller.findByIdAndUpdate(
      { _id: verifyToken.sellerId },
      {
        $pull: {
          products: {
            _id: req.params.id,
          },
        },
      }
    );

    allProducts = allProducts.filter((elm) => elm._id != req.params.id);

    res.status(StatusCodes.OK).json("Deleted successfully!");
  } else {
    res.status(StatusCodes.BAD_REQUEST).json("Couldn't delete the product.");
  }
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

const getHistory = async (req, res) => {
  const verifyToken = jwt.verify(req.body.token, process.env.SECRET);

  if (verifyToken) {
    const id = verifyToken.sellerId;

    const history = [];

    await Order.findOne({ sellerID: id }).then((order) => {
      Seller.findOne({ _id: id }).then((seller) => {
        const s = seller.products;
        const o = order.products;
        for (let i = 0; i < o.length; i++) {
          for (let j = 0; j < s.length; j++) {
            if (String(s[j]._id) == String(o[i].id)) {
              history.push({ id: o[i].id, quantity: o[i].quantity });
            }
          }
        }
        res.status(StatusCodes.OK).json(history);
      });
    });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json("Please log in.");
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
  getProductInfo,
  getHistory,
};
