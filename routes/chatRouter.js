const express = require("express");
const router = express.Router();
const {
  createChat,
  findChats,
  findUserChat,
} = require("../controllers/chatController");

router.post("/", createChat);
router.get("/:adminId", findChats);
router.get("/find/:firstId/:secondId", findUserChat);

module.exports = router;
