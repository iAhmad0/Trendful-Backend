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
    getAdmin, 
    getAllAdmins, 
    updateAdmin, 
    deleteAdmin, 
    createProduct, 
    getAllProducts, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/adminController') 
 
const { 
     loginAdmin,  
    signupAdmin, 
    protected, 
} = require('../controllers/auth-adminController') 
 
// Buyers 
router.get('/admin/get-buyers', protected,getAllBuyers); 
router.put('/admin/update-buyer/:id', protected, updateBuyer); 
router.delete('/admin/delete-buyer/:id', protected, deleteBuyer); 
// Sellers 
router.get('/admin/get-sellers', protected, getAllSellers); 
router.put('/admin/update-seller/:id', protected, updateSeller); 
router.delete('/admin/delete-seller/:id', protected, deleteSeller); 
// admins 
router.post('/signup-admin', signupAdmin); 
router.post('/login-admin', loginAdmin); 
router.get('/get-admin/:id', protected, getAdmin); 
router.get('/get-admins', protected, getAllAdmins); 
router.put('/update-admin/:id', protected, updateAdmin); 
router.delete('/delete-admin/:id', protected, deleteAdmin); 
// products 
router.post('/admin/create-product', protected, createProduct); 
router.get('/admin/get-products', protected, getAllProducts); 
router.put('/admin/update-product/:id', protected, updateProduct); 
router.delete('/admin/delete-product/:id', protected, deleteProduct); 
 
 
module.exports = router;