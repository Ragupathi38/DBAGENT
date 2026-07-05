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

module.exports = {
    testConnection,
    listTables
};
