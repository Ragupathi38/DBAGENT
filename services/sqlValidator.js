function validateSQL(sql) {

    if (!sql || sql.trim() === "") {
        return {
            valid: false,
            reason: "Empty SQL Query"
        };
    }

    sql = sql.trim();

    const firstWord = sql.split(/\s+/)[0].toUpperCase();

    // Safe Queries
    if (["SELECT", "SHOW", "DESCRIBE"].includes(firstWord)) {
        return {
            valid: true,
            requiresConfirmation: false,
            type: firstWord
        };
    }

    // Data Modification Queries
    if (["INSERT", "UPDATE", "DELETE"].includes(firstWord)) {
        return {
            valid: true,
            requiresConfirmation: true,
            type: firstWord
        };
    }

    // Dangerous Queries
    if (["DROP", "ALTER", "TRUNCATE"].includes(firstWord)) {
        return {
            valid: false,
            reason: `${firstWord} queries are not allowed.`,
            type: firstWord
        };
    }

    // Everything else
    return {
        valid: false,
        reason: "Unsupported SQL Statement.",
        type: firstWord
    };
}

module.exports = validateSQL;