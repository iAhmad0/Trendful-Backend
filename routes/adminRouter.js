const express = require("express");
const router = express.Router();

//controller functions
const {
  getAllSellers,
  updateSeller,
  deleteSeller,
  getAllBuyers,
  updateBuyer,
  deleteBuyer,
  getAllProducts,
  deleteProduct,
} = require("../controllers/adminController");

const {
  loginAdmin,
  protected,
} = require("../controllers/auth-adminController");

// Sellers
router.get("/admin/get-sellers", protected, getAllSellers);
router.put("/admin/update-seller/:id", protected, updateSeller);
router.delete("/admin/delete-seller/:id", protected, deleteSeller);

// Buyers
router.get("/admin/get-buyers", protected, getAllBuyers);
router.put("/admin/update-buyer/:id", protected, updateBuyer);
router.delete("/admin/delete-buyer/:id", protected, deleteBuyer);

// Admins
router.post("/admin-login", loginAdmin);
// router.post("/api/admin-valid/", protected, getAdmin);

// products
router.get("/admin/get-products", protected, getAllProducts);
router.delete("/admin/delete-product/:id", protected, deleteProduct);

module.exports = router;
