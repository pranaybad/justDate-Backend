const express = require("express");
const router = express.Router();
const { sendMessage, getMessages } = require("../controllers/chatController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/send", authMiddleware, sendMessage);
router.get("/conversation/:userId", authMiddleware, getMessages);

module.exports = router;
