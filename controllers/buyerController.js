const Buyer = require("../models/buyer");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");

// login buyer
const loginBuyer = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("please provide email and password");
  }

  const buyer = await Buyer.findOne({ email });
  if (!buyer) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await buyer.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = buyer.createJWT();
  res
    .status(StatusCodes.OK)
    .json({ name: buyer.name, token, successful: true });
};

// signup buyer
const signupBuyer = async (req, res) => {
  const buyer = await Buyer.create({ ...req.body });

  const token = buyer.createJWT();

  res.status(StatusCodes.CREATED).json({ name: buyer.name, token });
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

const getBuyerInfo = async (req, res) => {
  try {
    const verifyToken = jwt.verify(req.body.token, process.env.SECRET);
    if (verifyToken) {
      const buyer = await Buyer.findById(verifyToken.buyerId);

      res.status(StatusCodes.OK).json({
        valid: true,
        name: buyer.name,
        email: buyer.email,
        mobile: buyer.mobile,
      });
    }
  } catch (err) {
    res.status(StatusCodes.FORBIDDEN).json({ valid: false });
  }
};

module.exports = { loginBuyer, signupBuyer, checkToken, getBuyerInfo };
