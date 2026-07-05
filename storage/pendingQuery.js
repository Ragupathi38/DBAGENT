let pendingSQL = null;

function setPendingSQL(sql) {
    pendingSQL = sql;
}

function getPendingSQL() {
    return pendingSQL;
}

function clearPendingSQL() {
    pendingSQL = null;
}

module.exports = {
    setPendingSQL,
    getPendingSQL,
    clearPendingSQL
};