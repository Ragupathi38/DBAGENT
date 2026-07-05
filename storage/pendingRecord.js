let pendingRecord = null;

function setPendingRecord(data) {

    pendingRecord = data;

}

function getPendingRecord() {

    return pendingRecord;

}

function clearPendingRecord() {

    pendingRecord = null;

}

module.exports = {

    setPendingRecord,

    getPendingRecord,

    clearPendingRecord

};