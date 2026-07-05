const { findRecords } = require("./recordFinderEngine");

// ======================================
// Check for ambiguous records
// ======================================

async function checkAmbiguity(context) {

    if (
        context.operation !== "UPDATE" &&
        context.operation !== "DELETE"
    ) {
        return {
            ambiguous: false
        };
    }

    if (!context.table || !context.where) {
        return {
            ambiguous: false
        };
    }

    const rows = await findRecords(
        context.table,
        context.where
    );

    if (rows.length === 0) {

        return {
            ambiguous: false,
            exists: false
        };

    }

    if (rows.length === 1) {

        return {
            ambiguous: false,
            exists: true,
            row: rows[0]
        };

    }

    return {

        ambiguous: true,

        rows

    };

}

module.exports = {

    checkAmbiguity

};