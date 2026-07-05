const db = require("../config/db");
const {
    checkAmbiguity
} = require("../engines/executionSafetyEngine");
const { loadKnowledge } = require("./databaseKnowledge");

const {
    classifyError
} = require("../engines/errorClassifierEngine");

const {
    recover
} = require("../engines/errorRecoveryEngine");
const {
    extractContext
} = require("../engines/sqlContextEngine");
// ========================================
// Execute SQL
// ========================================

// ========================================
// Execute SQL
// ========================================

async function executeSQL(sql) {

    // ======================================
    // Extract SQL Context
    // ======================================

    const context = extractContext(sql);
    const safety = await checkAmbiguity(context);

if (!safety.success) {

    return {

        success: false,

        message: safety.message

    };

}

    console.log("\n========== SQL CONTEXT ==========");

    console.log(context);

    console.log("=================================\n");

    return new Promise((resolve, reject) => {

        db.query(sql, async (err, result) => {

            if (err) {

                console.log("\n==============================");
                console.log("MYSQL ERROR");
                console.log(err.message);

                const classification = classifyError(err.message);

                console.log("\nCLASSIFICATION");
                console.log(classification);

                // Pass the SQL context also
                const recovery = recover(classification, context);

                console.log("\nRECOVERY");
                console.log(recovery);

                console.log("==============================\n");

                return resolve({

                    success: false,

                    recoverable: recovery.recoverable,

                    classification,

                    recovery

                });

            }
// ======================================
// UPDATE / DELETE Safety Check
// ======================================

if (

    (context.operation === "UPDATE" ||

     context.operation === "DELETE")

) {

    if (result.affectedRows === 0) {

        return resolve({

            success: false,

            recoverable: false,

            message:
`❌ No matching records found in table "${context.table}".

Nothing was updated or deleted.`

        });

    }

}

// ======================================

try {

    // Refresh database knowledge
    await loadKnowledge();

}

catch (e) {

    console.log("Knowledge reload failed:", e.message);

}

resolve({

    success: true,

    message:

        result.affectedRows !== undefined

            ? `✅ ${result.affectedRows} row(s) affected.`

            : "✅ Query executed successfully.",

    result

});

        });

    });

}

module.exports = {

    executeSQL

};