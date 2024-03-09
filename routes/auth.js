const express = require("express");
const router = express.Router();

// controller functions
const { loginUser, signupUser } = require("../controllers/auth");

// signup route
router.post("/signup", signupUser);

// login route
router.post("/login", loginUser);

module.exports = router;
