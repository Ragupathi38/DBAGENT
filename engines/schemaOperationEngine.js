// ======================================
// Schema Operation Engine
// ======================================

// ======================================
// CREATE TABLE
// ======================================

function createTable(tableName, columns) {

    return `
CREATE TABLE \`${tableName}\` (

${columns}

);
`;

}

// ======================================
// DROP TABLE
// ======================================

function dropTable(tableName) {

    return `
DROP TABLE \`${tableName}\`;
`;

}

// ======================================
// RENAME TABLE
// ======================================

function renameTable(oldTable, newTable) {

    return `
RENAME TABLE \`${oldTable}\`
TO \`${newTable}\`;
`;

}

// ======================================
// ADD COLUMN
// ======================================

function addColumn(table, column, datatype) {

    return `
ALTER TABLE \`${table}\`
ADD COLUMN \`${column}\`
${datatype};
`;

}

// ======================================
// DROP COLUMN
// ======================================

function dropColumn(table, column) {

    return `
ALTER TABLE \`${table}\`
DROP COLUMN \`${column}\`;
`;

}

// ======================================
// RENAME COLUMN
// ======================================

function renameColumn(
    table,
    oldColumn,
    newColumn,
    datatype
) {

    return `
ALTER TABLE \`${table}\`

CHANGE COLUMN

\`${oldColumn}\`

\`${newColumn}\`

${datatype};
`;

}

// ======================================
// MODIFY DATATYPE
// ======================================

function changeDatatype(
    table,
    column,
    datatype
) {

    return `
ALTER TABLE \`${table}\`

MODIFY COLUMN

\`${column}\`

${datatype};
`;

}

// ======================================
// ADD PRIMARY KEY
// ======================================

function addPrimaryKey(table, column) {

    return `
ALTER TABLE \`${table}\`

ADD PRIMARY KEY(\`${column}\`);
`;

}

// ======================================
// DROP PRIMARY KEY
// ======================================

function dropPrimaryKey(table) {

    return `
ALTER TABLE \`${table}\`

DROP PRIMARY KEY;
`;

}

// ======================================
// ADD FOREIGN KEY
// ======================================

function addForeignKey(

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
// DROP FOREIGN KEY
// ======================================

function dropForeignKey(
    table,
    constraint
) {

    return `
ALTER TABLE \`${table}\`

DROP FOREIGN KEY \`${constraint}\`;
`;

}

// ======================================
// ADD UNIQUE KEY
// ======================================

function addUnique(table, column) {

    return `
ALTER TABLE \`${table}\`

ADD UNIQUE(\`${column}\`);
`;

}

// ======================================
// DROP UNIQUE KEY
// ======================================

function dropUnique(table, key) {

    return `
ALTER TABLE \`${table}\`

DROP INDEX \`${key}\`;
`;

}

// ======================================
// ADD INDEX
// ======================================

function addIndex(table, column) {

    return `
CREATE INDEX idx_${column}

ON \`${table}\`

(\`${column}\`);
`;

}

// ======================================
// DROP INDEX
// ======================================

function dropIndex(table, index) {

    return `
DROP INDEX \`${index}\`

ON \`${table}\`;
`;

}

// ======================================
// TRUNCATE TABLE
// ======================================

function truncateTable(table) {

    return `
TRUNCATE TABLE \`${table}\`;
`;

}

// ======================================
// EXPORTS
// ======================================

module.exports = {

    createTable,

    dropTable,

    renameTable,

    addColumn,

    dropColumn,

    renameColumn,

    changeDatatype,

    addPrimaryKey,

    dropPrimaryKey,

    addForeignKey,

    dropForeignKey,

    addUnique,

    dropUnique,

    addIndex,

    dropIndex,

    truncateTable

};