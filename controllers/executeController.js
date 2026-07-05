const {
    executeSQL: executeQuery
} = require("../services/executionService");

// Old pending query (AI)
const {
    getPendingSQL,
    clearPendingSQL
} = require("../storage/pendingQuery");

// New SQL Session (Conversation Engine)
const {
    getSQL,
    clearSQL
} = require("../storage/sqlSession");

async function executeSQL(req, res) {

    try {

        // First check Conversation Engine
        let sql = getSQL();

        let source = "session";

        // If empty, check old AI pending query
        if (!sql) {

            sql = getPendingSQL();

            source = "pending";

        }

        if (!sql) {

            return res.status(400).json({

                success: false,

                message: "No SQL found to execute."

            });

        }

        // Execute using Execution Engine
       // ======================================
// Execute using Execution Engine
// ======================================

const result = await executeQuery(sql);

// ======================================
// Recovery Required
// ======================================

if (!result.success && result.recoverable) {

    return res.json({

        success: false,

        conversation: true,

        step: "ERROR_RECOVERY",

        message: result.recovery.message,

        recovery: result.recovery,

        classification: result.classification,

        originalSQL: sql

    });

}

// ======================================
// Clear SQL only after successful execution
// ======================================

if (source === "session") {

    clearSQL();

}

else {

    clearPendingSQL();

}

// ======================================

return res.json({

    success: true,

    message: result.message,

    executedSQL: sql,

    result: result.result

});

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            error: error.message

        });

    }

}

module.exports = {

    executeSQL

};