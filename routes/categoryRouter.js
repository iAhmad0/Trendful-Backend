const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
} = require("../controllers/categoryController");

router.get("/api/categories", getCategories);
router.post("/api/categories", createCategory);

module.exports = router;
