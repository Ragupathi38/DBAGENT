const db = require("../config/db");

// =========================================
// Execute SELECT to check affected rows
// =========================================

function checkRecordExists(table, whereClause) {

    return new Promise((resolve, reject) => {

        const sql = `SELECT * FROM ${table} WHERE ${whereClause}`;

        db.query(sql, (err, rows) => {

            if (err) {

                return reject(err);

            }

            resolve(rows);

        });

    });

}

// =========================================
// Validate UPDATE / DELETE
// =========================================

async function validateExecution(context) {

    // Only UPDATE & DELETE for now

    if (

        context.operation !== "UPDATE" &&

        context.operation !== "DELETE"

    ) {

        return {

            safe: true

        };

    }

    if (

        !context.table ||

        !context.where

    ) {

        return {

            safe: true

        };

    }

    const rows = await checkRecordExists(

        context.table,

        context.where

    );

    // ----------------------------
    // No rows
    // ----------------------------

    if (rows.length === 0) {

        return {

            safe: false,

            message:
`❌ No matching records found in "${context.table}".`

        };

    }

    // ----------------------------
    // Multiple rows
    // ----------------------------

    if (rows.length > 1) {

        return {

            safe: false,

            message:
`⚠ ${rows.length} matching records found.

Please refine your request before updating or deleting.`,

            rows

        };

    }

    // ----------------------------
    // Safe
    // ----------------------------

    return {

        safe: true,

        rows

    };

}

module.exports = {

    validateExecution

};