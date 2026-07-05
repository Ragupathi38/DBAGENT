const express = require("express");

const router = express.Router();

const {
    continueConversation
} = require("../controllers/conversationController");

router.post("/conversation", continueConversation);

module.exports = router;