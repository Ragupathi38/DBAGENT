const {
    getPendingRecord,
    setPendingRecord,
    clearPendingRecord
} = require("../storage/pendingRecord");

function startRecordSelection(sql, rows) {

    setPendingRecord({

        sql,

        rows

    });

}

function getRecordSelection() {

    return getPendingRecord();

}

function finishRecordSelection() {

    clearPendingRecord();

}

module.exports = {

    startRecordSelection,

    getRecordSelection,

    finishRecordSelection

};