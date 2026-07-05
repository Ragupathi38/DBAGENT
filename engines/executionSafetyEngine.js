const { findRecords } = require("./recordFinderEngine");

async function checkAmbiguity(context) {

    if (
        context.operation !== "UPDATE" &&
        context.operation !== "DELETE"
    ) {

        return {

            success: true

        };

    }

    if (!context.where) {

        return {

            success: true

        };

    }

    const rows = await findRecords(

        context.table,

        context.where

    );

    if (rows.length === 0) {

        return {

            success: false,

            message:
`❌ No matching record found in table "${context.table}".`

        };

    }

    if (rows.length > 1) {

        return {

            success: false,

            message:
`⚠ Multiple matching records found.

Please update using the Employee ID.

Example:

Update employee id 5 salary to 60000`

        };

    }

    return {

        success: true

    };

}

module.exports = {

    checkAmbiguity

};