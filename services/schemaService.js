const db = require("../config/db");

async function getSchema() {

    const res = await db.query("SHOW TABLES");
    const tables = res.rows || res;

    let schema = "";

    for (const table of tables) {

        const tableName = Object.values(table)[0];

        schema += `Table: ${tableName}\n`;

        const colsRes = await db.query(`DESCRIBE ${tableName}`);
        const columns = colsRes.rows || colsRes;

        columns.forEach(col => {
            schema += `- ${col.Field} (${col.Type})\n`;
        });

        schema += "\n";

    }

    return schema;

}
module.exports = getSchema;