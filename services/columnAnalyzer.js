const db = require("../config/db");

async function getColumns(tableName) {

    const result = await db.query(`SHOW COLUMNS FROM ${tableName}`);
    const rows = result.rows || result;
    return rows.map(col => col.Field);

}

async function findColumn(columnName) {

    return new Promise(async (resolve, reject) => {

            try {

                const result = await db.query("SHOW TABLES");
                const tables = result.rows || result;

                const key = tables.length ? Object.keys(tables[0])[0] : null;

                const matches = [];

                for (const row of tables) {

                    const table = row[key];

                    const columns = await getColumns(table);

                    columns.forEach(col => {

                        if (col.toLowerCase() === columnName.toLowerCase()) {

                            matches.push({
                                table,
                                column: col
                            });

                        }

                    });

                }

                resolve(matches);

            }

            catch (err) {

                reject(err);

            }

    });

}

module.exports = {

    getColumns,

    findColumn

};