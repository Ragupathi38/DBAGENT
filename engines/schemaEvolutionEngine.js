// ======================================
// Schema Evolution Engine
// ======================================

const db = require("../config/db");

// ======================================
// Execute Schema Change
// ======================================

async function executeEvolution(sql) {

    return new Promise((resolve, reject) => {

        db.query(sql, (err, result) => {

            if (err) {

                return reject(err);

            }

            resolve({

                success: true,

                result

            });

        });

    });

}

// ======================================
// Change Datatype
// ======================================

function buildAlterDatatype(table, column, datatype) {

    return `
ALTER TABLE \`${table}\`
MODIFY COLUMN \`${column}\` ${datatype};
`;

}

// ======================================
// Add Column
// ======================================

function buildAddColumn(table, column, datatype) {

    return `
ALTER TABLE \`${table}\`
ADD COLUMN \`${column}\` ${datatype};
`;

}

// ======================================
// Drop Column
// ======================================

function buildDropColumn(table, column) {

    return `
ALTER TABLE \`${table}\`
DROP COLUMN \`${column}\`;
`;

}

// ======================================
// Rename Column
// ======================================

function buildRenameColumn(table, oldName, newName, datatype) {

    return `
ALTER TABLE \`${table}\`
CHANGE COLUMN \`${oldName}\`
\`${newName}\` ${datatype};
`;

}

// ======================================
// Rename Table
// ======================================

function buildRenameTable(oldTable, newTable) {

    return `
ALTER TABLE \`${oldTable}\`
RENAME TO \`${newTable}\`;
`;

}

// ======================================
// Add Primary Key
// ======================================

function buildPrimaryKey(table, column) {

    return `
ALTER TABLE \`${table}\`
ADD PRIMARY KEY(\`${column}\`);
`;

}

// ======================================
// Add Foreign Key
// ======================================

function buildForeignKey(

    table,
    column,
    referenceTable,
    referenceColumn

) {

    return `
ALTER TABLE \`${table}\`

ADD CONSTRAINT fk_${table}_${column}

FOREIGN KEY (\`${column}\`)

REFERENCES \`${referenceTable}\`

(\`${referenceColumn}\`);
`;

}
// ======================================
// Drop Column
// ======================================

function buildDropColumn(table, column) {

    return `
ALTER TABLE \`${table}\`
DROP COLUMN \`${column}\`;
`;

}
// ======================================
// Drop Table
// ======================================

function buildDropTable(table) {

    return `
DROP TABLE \`${table}\`;
`;

}

// ======================================

module.exports = {

    executeEvolution,

    buildAlterDatatype,

    buildAddColumn,

    buildDropColumn,

    buildRenameColumn,

    buildRenameTable,

    buildPrimaryKey,

    buildForeignKey,

    buildDropTable

};