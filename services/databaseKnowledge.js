const db = require("../config/db");

let knowledge = {
    tables: {}
};

// ==========================================
// Load Database Knowledge
// ==========================================

async function loadKnowledge() {

    const result = await db.query("SHOW TABLES");
    const tables = result.rows || result; // support both shapes

    if (!Array.isArray(tables) || tables.length === 0) {
        knowledge.tables = {};
        console.log("✅ Database Knowledge Loaded (no tables)");
        return;
    }

    const tableKey = Object.keys(tables[0])[0];

    knowledge.tables = {};

    for (const row of tables) {

        const tableName = row[tableKey];

        const columns = await getColumns(tableName);

        knowledge.tables[tableName] = {

            columns,

            aliases: [
                tableName,
                tableName.endsWith("s")
                    ? tableName.slice(0, -1)
                    : tableName
            ]

        };

    }

    console.log("✅ Database Knowledge Loaded");

}

// ==========================================

async function getColumns(tableName) {

    const result = await db.query(`SHOW COLUMNS FROM ${tableName}`);
    const rows = result.rows || result;
    return rows.map(col => col.Field);

}

// ==========================================

function getKnowledge() {

    return knowledge;

}

// ==========================================
// Find Table
// ==========================================

function findTable(word) {

    word = word.toLowerCase();

    for (const table in knowledge.tables) {

        const aliases = knowledge.tables[table].aliases;

        if (aliases.includes(word)) {

            return table;

        }

    }

    return null;

}

// ==========================================
// Find Column
// ==========================================

function findColumn(word) {

    word = word.toLowerCase();

    const matches = [];

    for (const table in knowledge.tables) {

        const columns = knowledge.tables[table].columns;

        columns.forEach(column => {

            if (column.toLowerCase() === word) {

                matches.push({

                    table,

                    column

                });

            }

        });

    }

    return matches;

}

// ==========================================
// Suggestions
// ==========================================

function getSuggestions(word) {

    word = word.toLowerCase();

    const suggestions = [];

    for (const table in knowledge.tables) {

        if (
            table.toLowerCase().includes(word) ||
            word.includes(table.toLowerCase())
        ) {

            suggestions.push(table);

        }

    }

    return suggestions;

}

// ==========================================

module.exports = {

    loadKnowledge,

    getKnowledge,

    findTable,

    findColumn,

    getSuggestions

};