const { executeSQL } = require("../services/executionService");

const {
    getRecoverySQL,
    getOriginalSQL,
    clearRecovery
} = require("../storage/recoverySession");

async function applyRecovery(req, res) {

    try {

        const recoverySQL = getRecoverySQL();
        const originalSQL = getOriginalSQL();

        if (!recoverySQL) {

            return res.status(400).json({

                success: false,
                message: "No recovery operation found."

            });

        }

        console.log("\n========== APPLYING RECOVERY ==========");
        console.log(recoverySQL);

        // Step 1
        const {
    executeEvolution
} = require("../engines/schemaEvolutionEngine");

// ==========================
// Apply Schema Fix
// ==========================

const {
    loadKnowledge
} = require("../services/databaseKnowledge");

await loadKnowledge();

console.log("✅ Database Knowledge Reloaded");
        if (!recoveryResult.success) {

            return res.json({

                success: false,
                message: "Failed to apply recovery."

            });

        }

        console.log("\n========== RETRYING ORIGINAL SQL ==========");
        console.log(originalSQL);

        // Step 2
        console.log("\n========== RETRYING ORIGINAL SQL ==========");

const retryResult = await executeSQL(originalSQL);

if (!retryResult.success) {

    return res.json({

        success: false,

        message: "Schema updated, but the original query still failed.",

        details: retryResult

    });

}

        clearRecovery();

        if (!retryResult.success) {

            return res.json({

                success: false,
                message: "Recovery applied, but original query still failed."

            });

        }

        return res.json({

            success: true,

            message:
                "🎉 Recovery completed successfully.\nOriginal query executed successfully."

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            error: err.message

        });

    }

}

module.exports = {

    applyRecovery

};
clearRecovery();