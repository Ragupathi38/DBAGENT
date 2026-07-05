const express = require("express");

const router = express.Router();

const {
    applyRecovery
} = require("../controllers/recoveryController");

router.post("/recovery", applyRecovery);

module.exports = router;