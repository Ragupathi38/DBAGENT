const db = require("../config/db");

async function getTables() {

    return new Promise((resolve, reject) => {

        db.query("SHOW TABLES", (err, results) => {

            if (err) {
                return reject(err);
            }

            const key = Object.keys(results[0])[0];

            const tables = results.map(row => row[key]);

            resolve(tables);

        });

    });

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