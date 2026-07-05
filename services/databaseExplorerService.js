const db = require("../config/db");

async function getDatabaseInfo() {

    try {

        const result = [];

        const res = await db.query("SHOW TABLES");
        const tables = res.rows || res;

        for (const table of tables) {

            const tableName = Object.values(table)[0];

            const countRes = await db.query(`SELECT COUNT(*) AS count FROM ${tableName}`);
            const rows = (countRes.rows || countRes)[0].count;

            const colsRes = await db.query(`SHOW COLUMNS FROM ${tableName}`);
            const columns = (colsRes.rows || colsRes).length;

            result.push({ name: tableName, rows, columns });

        }

        return { database: process.env.DB_NAME, tables: result };

    } catch (error) {

        throw error;

    }

}

module.exports = {

    getDatabaseInfo

};