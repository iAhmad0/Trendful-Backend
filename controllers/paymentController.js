const Card = require('../models/payment')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError } = require('../errors')

const addPaymentCard = async(req,res)=>{
    const { buyerId } = req.user;
    req.body.ownerId = buyerId;
    const newCard = await Card.create(req.body );
    res.status(StatusCodes.CREATED).json({
        status: "success",
        data: {
            card: newCard,
        },
    });
};
const getPaymentCardInfo = async(req,res) => {
    const card = await Card.findById(req.params.id);
    if (!card) {
        throw new NotFoundError(`no card with id ${req.params.id} `);
    }
    res.status(StatusCodes.OK).json({ card });
};
const getAllPaymentCardsInfo = async(req,res) => {
    const { buyerId } = req.user;
    const cards = await Card.find({ownerId: buyerId});
    if (!cards) {
        throw new NotFoundError(`no cards for user id ${userId} `);
    }
    res.status(StatusCodes.OK).json({ cards });
};
const deletePaymentCard = async(req ,res) => {
    const card = await Card.findByIdAndRemove(req.params.id);
    if (!card) {
        throw new NotFoundError(`no card with id ${req.params.id} `);
    }
    res.status(StatusCodes.OK).send("card deleted successfully");
}

module.exports = {
    addPaymentCard,
    getAllPaymentCardsInfo,
    deletePaymentCard,
    getPaymentCardInfo,
}