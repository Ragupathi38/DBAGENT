const {
    findTable,
    findColumn,
    getKnowledge
} = require("./databaseKnowledge");

// ======================================
// Validate Table
// ======================================

function validateTable(tableName) {

    const table = findTable(tableName);

    if (!table) {

        return {

            success: false,

            message:
`❌ Table "${tableName}" does not exist.

Available tables:

• ${Object.keys(getKnowledge().tables).join("\n• ")}`

        };

    }

    return {

        success: true,

        table

    };

}

// ======================================
// Validate Column
// ======================================

function validateColumn(tableName, columnName) {

    const table = findTable(tableName);

    if (!table) {

        return {

            success: false,

            message:
`❌ Table "${tableName}" does not exist.`

        };

    }

    const columns = getKnowledge().tables[table].columns;

    if (!columns.includes(columnName)) {

        return {

            success: false,

            message:
`❌ Column "${columnName}" does not exist.

Available columns:

• ${columns.join("\n• ")}`

        };

    }

    return {

        success: true,

        table,

        column: columnName

    };

}

module.exports = {

    validateTable,

    validateColumn

};