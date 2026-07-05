const db = require("../config/db");

async function getColumns(tableName) {

    return new Promise((resolve, reject) => {

        db.query(`SHOW COLUMNS FROM ${tableName}`, (err, results) => {

            if (err) {
                return reject(err);
            }

            const columns = results.map(col => col.Field);

            resolve(columns);

        });

    });

}

async function findColumn(columnName) {

    return new Promise(async (resolve, reject) => {

        try {

            db.query("SHOW TABLES", async (err, tables) => {

                if (err) {
                    return reject(err);
                }

                const key = Object.keys(tables[0])[0];

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

            });

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