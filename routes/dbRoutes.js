const express = require("express");
const router = express.Router();

const { testConnection, listTables } = require("../controllers/dbController");

router.get("/db-test", testConnection);
router.get("/db-tables", listTables);

module.exports = router;
