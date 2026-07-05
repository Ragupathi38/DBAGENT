const express = require("express");
const router = express.Router();

const { askAI } = require("../controllers/aiController");

router.get("/ask", askAI);

module.exports = router;