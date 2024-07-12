const express = require("express");
const router = express.Router();

//controller functions
const {
  getAllSellers,
  editSeller,
  deleteSeller,
  getAllBuyers,
  editBuyer,
  deleteBuyer,
  getAllProducts,
  addHomeProduct,
  removeHomeProduct,
  getHomeProducts,
} = require("../controllers/adminController");

const {
  loginAdmin,
  protected,
} = require("../controllers/auth-adminController");

// Admins
router.post("/control/admin-login", loginAdmin);

// products
// router.get("/admin/get-products", protected, getAllProducts);

router.get("/api/get-home-products", getHomeProducts);
router.post("/admin/add-home-product", addHomeProduct);
router.post("/admin/remove-home-product", removeHomeProduct);

router.get("/admin/get-sellers", getAllSellers);
router.put("/admin/edit-seller", editSeller);
router.delete("/admin/delete-seller/:id", deleteSeller);

router.get("/admin/get-buyers", getAllBuyers);
router.put("/admin/edit-buyer", editBuyer);
router.delete("/admin/delete-buyer/:id", deleteBuyer);

module.exports = router;
