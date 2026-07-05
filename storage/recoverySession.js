let recoverySQL = null;
let originalSQL = null;

// =============================

function setRecovery(sql, original) {

    recoverySQL = sql;
    originalSQL = original;

}

// =============================

function getRecoverySQL() {

    return recoverySQL;

}

// =============================

function getOriginalSQL() {

    return originalSQL;

}

// =============================

function clearRecovery() {

    recoverySQL = null;
    originalSQL = null;

}

// =============================

module.exports = {

    setRecovery,
    getRecoverySQL,
    getOriginalSQL,
    clearRecovery

};