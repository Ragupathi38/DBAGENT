const express = require("express");

const router = express.Router();

const {
    showMemory
} = require("../controllers/memoryController");

router.get("/memory", showMemory);

module.exports = router;