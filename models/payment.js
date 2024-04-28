const mongoose = require('mongoose');

const paymentCardsSchema = new mongoose.Schema({
    cardNumber: {
        type: String,
        required: true,
        unique: true,
    },
    nameOnCard: {
        type: String,
        required: true,
    },
    expirationDate: {
        type: Date,
        require: true,
    },
    ownerId: {
        type: String,
        // type: Schema.Types.ObjectId,
        // ref: 'Buyer',
        //required: true,
    },
}) 
module.exports = mongoose.model("Payment Cards", paymentCardsSchema);