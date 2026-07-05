const {
    startCreateTable
} = require("../services/conversationService");

const {
    findTable,
    findColumn,
    getKnowledge
} = require("../services/databaseKnowledge");
const {
    setSQL
} = require("../storage/sqlSession");

const {

    dropTable,

    dropColumn,

    renameTable,

    renameColumn,

    changeDatatype,

    truncateTable

} = require("../engines/schemaOperationEngine");

// ======================================

async function schemaHandler(question, res) {

    try {

        const text = question.trim().toLowerCase();

        // ======================================
        // CREATE TABLE
        // ======================================

        if (text.startsWith("create table")) {

            const match = text.match(
                /create\s+table\s+([a-zA-Z_][a-zA-Z0-9_]*)/i
            );

            if (!match) {

                return res.json({

                    conversation: true,

                    step: "TABLE_NAME",

                    message:
                        "Sure! What would you like to name the table?"

                });

            }

           const tableName = match[1];

// ===============================
// Validate Existing Table
// ===============================

const existingTable = findTable(tableName);

if (existingTable) {

    return res.json({

        success: false,

        error:
`❌ Table "${tableName}" already exists.

Please choose another table name.`

    });

}

// ===============================

startCreateTable(tableName);

            return res.json({

                conversation: true,

                step: "COLUMN_NAME",

                tableName,

                message:
`Great! I'll help you create the "${tableName}" table.

I'll automatically create an ID column.

What is the first column name?`

            });

        }

// ======================================
// DROP TABLE
// ======================================

if (

    text.startsWith("delete table") ||

    text.startsWith("drop table") ||

    text.startsWith("remove table")

) {

    const match = text.match(
        /(delete|drop|remove)\s+table\s+([a-zA-Z_][a-zA-Z0-9_]*)/i
    );

    if (!match) {

        return res.json({

            error: "Please specify the table name."

        });

    }

    const table = match[2];

    // ======================================
    // Validate Table
    // ======================================

    const existingTable = findTable(table);

    if (!existingTable) {

        return res.json({

            success: false,

            error:
`❌ Table "${table}" does not exist.

Available tables:

• ${Object.keys(getKnowledge().tables).join("\n• ")}`

        });

    }

    // ======================================

    const sql = dropTable(existingTable);

    setSQL(sql);

    return res.json({

        conversation: true,

        step: "CONFIRM_DROP_TABLE",

        generatedSQL: sql,

        requiresConfirmation: true,

        message:
`⚠ WARNING

Table : ${existingTable}

This table will be permanently deleted.

Do you want to continue?`

    });

}

        // ======================================
        // DROP COLUMN
        // ======================================

        if (

            text.startsWith("delete column") ||

            text.startsWith("drop column") ||

            text.startsWith("remove column")

        ) {

            const match = text.match(
                /(delete|drop|remove)\s+column\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+(from|in)\s+([a-zA-Z_][a-zA-Z0-9_]*)/i
            );

            if (!match) {

                return res.json({

                    error:
"Example:\nDelete column age from students"

                });

            }

            const column = match[2];

            const table = match[4];

            // ======================================
// Validate Table
// ======================================

const existingTable = findTable(table);

if (!existingTable) {

    return res.json({

        success: false,

        error:
`❌ Table "${table}" does not exist.

Available tables:

• ${Object.keys(getKnowledge().tables).join("\n• ")}`

    });

}

// ======================================
// Validate Column
// ======================================

const matches = findColumn(column);

const exists = matches.some(c => c.table === existingTable);

if (!exists) {

    const availableColumns =
        getKnowledge().tables[existingTable].columns;

    return res.json({

        success: false,

        error:
`❌ Column "${column}" does not exist in table "${existingTable}".

Available columns:

• ${availableColumns.join("\n• ")}`

    });

}

            const sql = dropColumn(existingTable, column);

            setSQL(sql);

            return res.json({

                conversation: true,

                step: "CONFIRM_DROP_COLUMN",

                generatedSQL: sql,

                requiresConfirmation: true,

                message:
`⚠ WARNING

Column : ${column}

Table : ${table}

This column will be permanently deleted.

Do you want to continue?`

            });

        }

        // ======================================
        // RENAME TABLE
        // ======================================

        if (

            text.startsWith("rename table")

        ) {

            const match = text.match(
                /rename\s+table\s+([a-zA-Z0-9_]+)\s+to\s+([a-zA-Z0-9_]+)/i
            );

            if (!match) {

                return res.json({

                    error:
"Example:\nRename table student to students"

                });

            }

            const sql = renameTable(

                match[1],

                match[2]

            );

            setSQL(sql);

            return res.json({

                conversation: true,

                step: "CONFIRM_RENAME_TABLE",

                generatedSQL: sql,

                requiresConfirmation: true,

                message:
`Rename table

${match[1]}

to

${match[2]} ?`

            });

        }

        // ======================================
        // RENAME COLUMN
        // ======================================

        if (

            text.startsWith("rename column")

        ) {

            return res.json({

                conversation: true,

                step: "RENAME_COLUMN",

                message:
"Rename Column Wizard will be implemented next."

            });

        }

        // ======================================
        // CHANGE DATATYPE
        // ======================================

        if (

            text.startsWith("change datatype") ||

            text.startsWith("modify datatype")

        ) {

            return res.json({

                conversation: true,

                step: "CHANGE_DATATYPE",

                message:
"Datatype Modification Wizard will be implemented next."

            });

        }

        // ======================================
        // TRUNCATE TABLE
        // ======================================

        if (

            text.startsWith("truncate table")

        ) {

            const match = text.match(
                /truncate\s+table\s+([a-zA-Z0-9_]+)/i
            );

            if (!match) {

                return res.json({

                    error:
"Please specify the table."

                });

            }

            const sql = truncateTable(match[1]);

            setSQL(sql);

            return res.json({

                conversation: true,

                step: "CONFIRM_TRUNCATE",

                generatedSQL: sql,

                requiresConfirmation: true,

                message:
`⚠ WARNING

All rows from

${match[1]}

will be deleted.

The table structure will remain.

Continue?`

            });

        }

        // ======================================

        return res.status(400).json({

            error:
"Unsupported schema operation."

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            error: error.message

        });

    }

}

module.exports = schemaHandler;