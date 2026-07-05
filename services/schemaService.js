const db = require("../config/db");

function getSchema() {
    return new Promise((resolve, reject) => {

        db.query("SHOW TABLES", async (err, tables) => {

            if (err) return reject(err);

            let schema = "";

            try {

                for (const table of tables) {

                    const tableName = Object.values(table)[0];

                    schema += `Table: ${tableName}\n`;

                    const columns = await new Promise((resolveColumns, rejectColumns) => {

                        db.query(`DESCRIBE ${tableName}`, (err, cols) => {

                            if (err) return rejectColumns(err);

                            resolveColumns(cols);

                        });

                    });

                    columns.forEach(col => {
                        schema += `- ${col.Field} (${col.Type})\n`;
                    });

                    schema += "\n";

                }

                resolve(schema);

            } catch (error) {

                reject(error);

            }

        });

    });
}

module.exports = getSchema;