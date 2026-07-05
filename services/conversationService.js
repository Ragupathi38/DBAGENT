const {
    generateIdentifier
} = require("../engines/identifierEngine");
const {
    getConversation,
    setConversation,
    clearConversation
} = require("../storage/conversationState");
const {
    detectNavigation
} = require("../engines/conversationNavigationEngine");

// =====================================
// Start CREATE TABLE Conversation
// =====================================

function startCreateTable(tableName) {

    setConversation({

        flow: "CREATE_TABLE",

        step: "COLUMN_NAME",

        tableName,

        currentColumn: null,

        columns: []

    });

}

// =====================================
// Get Current Conversation
// =====================================

function getCurrentConversation() {

    return getConversation();

}

// =====================================
// Process Next Step
// =====================================

async function processAnswer(answer) {

    const conversation = getConversation();

    if (!conversation) {

        return {

            error: "No active conversation."

        };

    }
    const navigation = await detectNavigation(
    conversation,
    answer
);

console.log("Navigation Engine:");
console.log(navigation);

    switch (conversation.step) {

        // ===========================
        // COLUMN NAME
        // ===========================

        case "COLUMN_NAME":

            conversation.currentColumn = answer;

            conversation.step = "COLUMN_TYPE";

            setConversation(conversation);

            return {

                step: "COLUMN_TYPE",

                message:
`What type of data will "${answer}" store?`,

                options: [

                    "Text (A-Z)",

                    "Whole Number",

                    "Decimal Number",

                    "Date",

                    "Yes / No"

                ]

            };

        // ===========================
        // COLUMN TYPE
        // ===========================

        case "COLUMN_TYPE":

            let sqlType = "";

            switch (answer) {

                case "Text (A-Z)":
                    sqlType = "VARCHAR(255)";
                    break;

                case "Whole Number":
                    sqlType = "INT";
                    break;

                case "Decimal Number":
                    sqlType = "DECIMAL(10,2)";
                    break;

                case "Date":
                    sqlType = "DATE";
                    break;

                case "Yes / No":
                    sqlType = "BOOLEAN";
                    break;

            }

            const existingNames = conversation.columns.map(col => col.sqlName);

const identifier = generateIdentifier(
    conversation.currentColumn,
    existingNames
);
console.log("RAW INPUT :", conversation.currentColumn);
console.log("IDENTIFIER:", identifier);
conversation.columns.push({

    displayName: identifier.displayName,

    sqlName: identifier.sqlName,

    type: sqlType

});

            conversation.currentColumn = null;

            conversation.step = "ADD_MORE";

            setConversation(conversation);

            return {

                step: "ADD_MORE",

                message:
"Do you want to add another column?",

                options: [

                    "Yes",

                    "No"

                ]

            };

        // ===========================
        // ADD MORE
        // ===========================

        case "ADD_MORE":

            if (answer === "Yes") {

                conversation.step = "COLUMN_NAME";

                setConversation(conversation);

                return {

                    step: "COLUMN_NAME",

                    message:
"What is the next column name?"

                };

            }

            conversation.step = "PREVIEW";

setConversation(conversation);

const sql = buildCreateTableSQL();

return {

    conversation: true,

    step: "PREVIEW",

    generatedSQL: sql,

    message: `Please review the SQL below.

Click Execute if everything looks correct.`

};

    }

}

// =====================================
// SQL Builder
// =====================================

function buildCreateTableSQL() {

    const conversation = getConversation();

    if (!conversation) return "";

    let sql = `CREATE TABLE ${conversation.tableName} (\n`;

    sql +=
`    id INT AUTO_INCREMENT PRIMARY KEY,\n`;

console.log("Conversation Columns:");
console.log(conversation.columns);
    conversation.columns.forEach((column, index) => {

        sql += `    ${column.sqlName} ${column.type}`;

        if (index !== conversation.columns.length - 1) {

            sql += ",";

        }

        sql += "\n";

    });

    sql += ");";

    return sql;

}

// =====================================

module.exports = {

    startCreateTable,

    processAnswer,

    buildCreateTableSQL,

    getCurrentConversation,

    clearConversation

};