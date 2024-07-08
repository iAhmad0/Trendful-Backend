const { StatusCodes } = require("http-status-codes");
const Category = require("../models/category");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(StatusCodes.OK).json(categories);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json(err);
  }
};

const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(StatusCodes.CREATED).json(category);
  } catch (err) {
    res.status(StatusCodes.CONFLICT).json(err);
  }
};

module.exports = { createCategory, getCategories };
