const chatModel = require('../models/chat')

const createChat = async (req, res) => {
    const { firstId, secondId } = req.body;
    try {
        const chat = await chatModel.findOne({
                members: {$all: [firstId, secondId]}
            });
    //check if chat exists
    if(chat) return res.status(200).json(chat);
    // create chat
    const newChat = new chatModel({
        members: [firstId, secondId]
    });
    const response = await newChat.save()
    res.status(200).json(response)
    }
    catch(error)
    {   console.log(error);
        res.status(500).json(error);
    }};

const findChats = async(req, res) =>{
    const adminId = req.params.adminId;
    try {
        const chats = await chatModel.find({
            members: {$in:[adminId]} 
        })
        res.status(200).json(chats);
    }
    catch(error)
    {   console.log(error);
        res.status(500).json(error);
    }
};

const findUserChat = async(req, res) =>{
    const { firstId, secondId } = req.params;
    try {
        const chat = await chatModel.findOne({
            members: {$all: [firstId, secondId]}
        });
        res.status(200).json(chat);
    }
    catch(error)
    {   console.log(error);
        res.status(500).json(error);
    }
};

module.exports= {
    createChat,
    findChats,
    findUserChat
}