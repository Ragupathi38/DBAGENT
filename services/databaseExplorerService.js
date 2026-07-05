const db = require("../config/db");

async function getDatabaseInfo() {

    return new Promise((resolve, reject) => {

        db.query("SHOW TABLES", async (err, tables) => {

            if (err) {

                return reject(err);

            }

            try {

                const result = [];

                for (const table of tables) {

                    const tableName = Object.values(table)[0];

                    const rows = await new Promise((resolve, reject) => {

                        db.query(
                            `SELECT COUNT(*) AS count FROM \`${tableName}\``,
                            (err, data) => {

                                if (err) return reject(err);

                                resolve(data[0].count);

                            }
                        );

                    });

                    const columns = await new Promise((resolve, reject) => {

                        db.query(
                            `SHOW COLUMNS FROM \`${tableName}\``,
                            (err, data) => {

                                if (err) return reject(err);

                                resolve(data.length);

                            }
                        );

                    });

                    result.push({

                        name: tableName,

                        rows,

                        columns

                    });

                }

                resolve({

                    database: process.env.DB_NAME,

                    tables: result

                });

            } catch (error) {

                reject(error);

            }

        });

    });

}

module.exports = {

    getDatabaseInfo

};