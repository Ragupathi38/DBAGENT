let pendingSQL = null;

// ===============================

function setSQL(sql) {

    pendingSQL = sql;

}

// ===============================

function getSQL() {

    return pendingSQL;

}

// ===============================

function clearSQL() {

    pendingSQL = null;

}

// ===============================

module.exports = {

    setSQL,

    getSQL,

    clearSQL

};