require("dotenv").config();

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

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

    try {
        const [rows] = await pool.query(sql, params);

        if (cb) return cb(null, rows);

        return rows;
    } catch (err) {
        console.error(err);

        if (cb) return cb(err);

        throw err;
    }
}

module.exports = {
    query
};