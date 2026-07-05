const db = require("../config/db");

// ======================================
// Find matching records
// ======================================

function findRecords(table, whereClause) {

    return new Promise((resolve, reject) => {

        const sql = `SELECT * FROM \`${table}\` WHERE ${whereClause}`;

        db.query(sql, (err, rows) => {

            if (err) {

                return reject(err);

            }

            resolve(rows);

        });

    });

}

module.exports = {

    findRecords

};