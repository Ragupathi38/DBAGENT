const express = require("express");

const router = express.Router();

const {
    getDatabase
} = require("../controllers/databaseController");

router.get("/database", getDatabase);

module.exports = router;