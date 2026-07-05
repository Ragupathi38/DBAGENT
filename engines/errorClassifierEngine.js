// ======================================
// Error Classifier Engine
// ======================================

function classifyError(errorMessage) {

    const message = errorMessage.toLowerCase();

    // ==================================
    // Datatype Mismatch
    // ==================================

    if (message.includes("incorrect integer value")) {

        const columnMatch = errorMessage.match(/column '([^']+)'/i);

        return {

            type: "DATATYPE_MISMATCH",

            recoverable: true,

            column: columnMatch ? columnMatch[1] : null,

            expectedType: "INT",

            suggestedType: "VARCHAR(255)",

            message:
                "The column expects a number but text was provided."

        };

    }

    // ==================================
    // Duplicate Entry
    // ==================================

    if (message.includes("duplicate entry")) {

        return {

            type: "DUPLICATE_ENTRY",

            recoverable: false,

            message:
                "A record with the same value already exists."

        };

    }

    // ==================================
    // Unknown Column
    // ==================================

    if (message.includes("unknown column")) {

        const columnMatch = errorMessage.match(/Unknown column '([^']+)'/i);

        return {

            type: "UNKNOWN_COLUMN",

            recoverable: true,

            column: columnMatch ? columnMatch[1] : null,

            message:
                "The requested column does not exist."

        };

    }

    // ==================================
    // Unknown Table
    // ==================================

    if (message.includes("doesn't exist")) {

        const tableMatch = errorMessage.match(/Table '.*\.([^']+)' doesn't exist/i);

        return {

            type: "UNKNOWN_TABLE",

            recoverable: true,

            table: tableMatch ? tableMatch[1] : null,

            message:
                "The requested table does not exist."

        };

    }

    // ==================================
    // Data Too Long
    // ==================================

    if (message.includes("data too long")) {

        const columnMatch = errorMessage.match(/column '([^']+)'/i);

        return {

            type: "DATA_TOO_LONG",

            recoverable: true,

            column: columnMatch ? columnMatch[1] : null,

            suggestedType: "VARCHAR(500)",

            message:
                "The value is longer than the column size."

        };

    }

    // ==================================
    // Default
    // ==================================

    return {

        type: "UNKNOWN",

        recoverable: false,

        message: errorMessage

    };

}

module.exports = {

    classifyError

};