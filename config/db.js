require("dotenv").config();

const { Pool } = require("pg");

// Prefer a full connection string (e.g. Render/Neon) via DATABASE_URL
const connectionString = process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING || process.env.DB_URL;

const pool = new Pool({
    connectionString,
    // Neon requires SSL; allow the connection string to opt-in via ?sslmode=require
    ssl: connectionString && connectionString.includes("neon.tech") ? { rejectUnauthorized: false } : undefined
});

pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
});

console.log("Database (connectionString):", connectionString ? "[provided]" : "[not provided]");

// Helper to emulate some mysql behaviors used elsewhere in the codebase
async function query(sql, paramsOrCallback, maybeCallback) {

    let params;
    let cb;

    if (typeof paramsOrCallback === "function") {
        cb = paramsOrCallback;
        params = [];
    } else {
        params = paramsOrCallback || [];
        cb = maybeCallback;
    }

    const normalized = sql.trim().toUpperCase();

    try {
        // Translate MySQL helper commands to Postgres equivalents
        if (normalized.startsWith("SHOW TABLES")) {
            const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
            // Return rows in a shape similar to MySQL's SHOW TABLES: [{Tables_in_db: 'table1'}, ...]
            const keyName = `Tables_in_${process.env.DB_NAME || "db"}`;
            const rows = res.rows.map(r => ({ [keyName]: r.table_name }));
            if (cb) return cb(null, rows);
            return { rows };
        }

        const showColumnsMatch = sql.trim().match(/^SHOW\s+COLUMNS\s+FROM\s+(.+)$/i);
        const describeMatch = sql.trim().match(/^DESCRIBE\s+(.+)$/i);

        if (showColumnsMatch || describeMatch) {
            const tableName = (showColumnsMatch && showColumnsMatch[1]) || (describeMatch && describeMatch[1]);
            // Remove any backticks or quotes
            const cleanName = tableName.replace(/[`"']/g, "");
            const colRes = await pool.query(
                `SELECT column_name, data_type, is_nullable
                 FROM information_schema.columns
                 WHERE table_name = $1`,
                [cleanName]
            );
            // Map to MySQL DESCRIBE/SHOW COLUMNS format: Field, Type
            const mapped = colRes.rows.map(r => ({ Field: r.column_name, Type: r.data_type }));
            if (cb) return cb(null, mapped);
            return { rows: mapped };
        }

        // Regular query
        const res = await pool.query(sql, params);

        // For SELECT return rows array like mysql
        if (res.command === "SELECT") {
            if (cb) return cb(null, res.rows);
            return { rows: res.rows };
        }

        // For INSERT/UPDATE/DELETE, emulate affectedRows
        res.affectedRows = res.rowCount;
        if (cb) return cb(null, res);
        return res;

    } catch (err) {
        return cb && cb(err);
    }

}

module.exports = {
    query
};