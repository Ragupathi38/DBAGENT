const db = require("../config/db");

async function testConnection(req, res) {
    try {
        const result = await db.query("SELECT NOW() as now");
        const rows = result.rows || result;
        return res.json({ success: true, now: rows[0] });
    } catch (err) {
        console.error("DB test error:", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
}

async function listTables(req, res) {
    try {
        const result = await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
        const rows = result.rows || result;
        const tables = rows.map(r => r.table_name || Object.values(r)[0]);
        return res.json({ success: true, tables });
    } catch (err) {
        console.error("DB listTables error:", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
}

async function writeTest(req, res) {
    try {
        // Create test table if not exists and insert a row
        await db.query(`CREATE TABLE IF NOT EXISTS test_write (id SERIAL PRIMARY KEY, txt TEXT, created_at TIMESTAMP DEFAULT NOW())`);
        const insertRes = await db.query(`INSERT INTO test_write (txt) VALUES ($1) RETURNING *`, [req.body && req.body.txt ? req.body.txt : 'test']);
        const row = insertRes.rows ? insertRes.rows[0] : insertRes[0];
        return res.json({ success: true, row });
    } catch (err) {
        console.error("DB writeTest error:", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
}

module.exports = {
    testConnection,
    listTables
};

