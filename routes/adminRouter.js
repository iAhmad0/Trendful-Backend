const express = require("express");
const router = express.Router();

//controller functions
const {
    getAllBuyers,
    getAllSellers,
    updateBuyer,
    updateSeller,
    deleteBuyer,
    deleteSeller,
    loginAdmin, 
    signupAdmin,
    getAdmin,
    getAllAdmins,
    updateAdmin,
    deleteAdmin,
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
} = require('../controllers/adminController')

// Buyers
router.get('/admin/get-buyers', getAllBuyers);
router.put('/admin/update-buyer/:id', updateBuyer);
router.delete('/admin/delete-buyer/:id', deleteBuyer);
// Sellers
router.get('/admin/get-sellers', getAllSellers);
router.put('/admin/update-seller/:id', updateSeller);
router.delete('/admin/delete-seller/:id', deleteSeller);
// admins
router.post('/signup-admin', signupAdmin);
router.post('/login-admin', loginAdmin);
router.get('/get-admin/:id', getAdmin);
router.get('/get-admins', getAllAdmins);
router.put('/update-admin/:id', updateAdmin);
router.delete('/delete-admin/:id', deleteAdmin);
// products
router.post('/admin/create-product', createProduct);
router.get('/admin/get-products', getAllProducts);
router.put('/admin/update-product/:id', updateProduct);
router.delete('/admin/delete-product/:id', deleteProduct);


module.exports = router;