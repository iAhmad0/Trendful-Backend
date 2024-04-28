const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth')

const {
    addPaymentCard,
    getAllPaymentCardsInfo,
    deletePaymentCard,
    getPaymentCardInfo,
} = require("../controllers/paymentController");


router.post('/payment/add-card',authMiddleware,addPaymentCard)
router.get('/payment/get-all-cards',authMiddleware,getAllPaymentCardsInfo)
router.get('/payment/get-card/:id',authMiddleware,getPaymentCardInfo)
router.delete('/payment/delete-card/:id',authMiddleware,deletePaymentCard)

module.exports = router;