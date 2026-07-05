const express = require("express");
const router = express.Router();

const { testConnection, listTables, writeTest } = require("../controllers/dbController");

router.get("/db-test", testConnection);
router.get("/db-tables", listTables);
router.post("/db-write-test", writeTest);

module.exports = router;
