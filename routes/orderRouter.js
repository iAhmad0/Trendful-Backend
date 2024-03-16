const express = require('express');
const router = express.Router();

const {
    createOrder,
    getOrder,
    getOrders,
    updateOrder,
    deleteOrder
} = require('../controllers/orderController')

router.post('/order', createOrder);
router.get('/getOrder/:id', getOrder);
router.get('/getOrders', getOrders);
router.put('/updateOrder/:id', updateOrder);
router.delete('/deleteOrder/:id', deleteOrder);



module.exports = router;


