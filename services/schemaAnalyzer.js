const db = require("../config/db");

async function getTables() {

    const res = await db.query("SHOW TABLES");
    const results = res.rows || res;
    if (!results || results.length === 0) return [];
    const key = Object.keys(results[0])[0];
    const tables = results.map(row => row[key]);
    return tables;

}

// ------------------------------------

async function tableExists(tableName) {

    const tables = await getTables();

    return tables.includes(tableName);

}

// ------------------------------------

async function getClosestTables(name) {

    const tables = await getTables();

    const lower = name.toLowerCase();

    return tables.filter(table =>
        table.toLowerCase().includes(lower) ||
        lower.includes(table.toLowerCase())
    );

}

module.exports = {

    getTables,

    tableExists,

    getClosestTables

};