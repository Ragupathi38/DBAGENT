const express = require("express");

const router = express.Router();

const {
    executeSQL
} = require("../controllers/executeController");

router.post("/execute", executeSQL);

module.exports = router;