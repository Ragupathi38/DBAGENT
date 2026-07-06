const db = require("../config/db");

async function testConnection(req, res) {
    try {
        const rows = await db.query("SELECT NOW() AS now");

        return res.json({
            success: true,
            now: rows[0]
        });

    } catch (err) {
        console.error("DB test error:", err.message);

        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

async function listTables(req, res) {
    try {
        const rows = await db.query("SHOW TABLES");

        const tables = rows.map(row => Object.values(row)[0]);

        return res.json({
            success: true,
            tables
        });

    } catch (err) {
        console.error("DB listTables error:", err.message);

        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

async function writeTest(req, res) {
    try {

        await db.query(`
            CREATE TABLE IF NOT EXISTS test_write (
                id INT AUTO_INCREMENT PRIMARY KEY,
                txt TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const text = req.body?.txt || "test";

        await db.query(
            "INSERT INTO test_write (txt) VALUES (?)",
            [text]
        );

        const rows = await db.query(
            "SELECT * FROM test_write ORDER BY id DESC LIMIT 1"
        );

        return res.json({
            success: true,
            row: rows[0]
        });

    } catch (err) {

        console.error("DB writeTest error:", err.message);

        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = {
    testConnection,
    listTables,
    writeTest
};