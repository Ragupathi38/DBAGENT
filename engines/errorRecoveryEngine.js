// ======================================
// Error Recovery Engine
// ======================================

function recover(classification, context)  {
console.log("Recovery Context:");
console.log(context);
    switch (classification.type) {

        // ==================================
        // Datatype Mismatch
        // ==================================

        case "DATATYPE_MISMATCH":

            return {

                recoverable: true,

                action: "CHANGE_DATATYPE",

                message:
`The column "${classification.column}" is currently ${classification.expectedType}.

I recommend changing it to ${classification.suggestedType}.

Would you like me to do that?`,

            sql:
`ALTER TABLE \`${context.table}\`
MODIFY COLUMN \`${classification.column}\` ${classification.suggestedType};`

            };

        // ==================================
        // Unknown Column
        // ==================================

        case "UNKNOWN_COLUMN":

            return {

                recoverable: true,

                action: "ADD_COLUMN",

                message:
`The column "${classification.column}" doesn't exist.

Would you like me to create it?`

            };

        // ==================================
        // Unknown Table
        // ==================================

        case "UNKNOWN_TABLE":

            return {

                recoverable: true,

                action: "CREATE_TABLE",

                message:
`The table "${classification.table}" doesn't exist.

Would you like me to create it?`

            };

        // ==================================
        // Data Too Long
        // ==================================

        case "DATA_TOO_LONG":

            return {

                recoverable: true,

                action: "INCREASE_SIZE",

                message:
`The value is larger than the current column size.

Would you like me to increase it to ${classification.suggestedType}?`

            };

        // ==================================
        // Duplicate Entry
        // ==================================

        case "DUPLICATE_ENTRY":

            return {

                recoverable: false,

                action: "NONE",

                message:
"A duplicate value already exists."

            };

        // ==================================
        // Unknown
        // ==================================

        default:

            return {

                recoverable: false,

                action: "NONE",

                message:
classification.message

            };

    }

}

module.exports = {

    recover

};