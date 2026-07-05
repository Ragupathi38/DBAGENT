// ======================================
// Conversation Memory Engine
// ======================================

let memory = {

    currentTable: null,

    currentColumn: null,

    currentDatatype: null,

    lastSQL: null,

    lastError: null,

    lastAction: null,

    lastIntent: null,

    previousStep: null,

    currentStep: null,

    history: []

};

// ======================================
// Save Memory
// ======================================

function update(data = {}) {

    memory = {

        ...memory,

        ...data

    };

}

// ======================================
// Add Conversation History
// ======================================

function addHistory(role, message) {

    memory.history.push({

        role,

        message,

        time: new Date().toISOString()

    });

    // Keep only last 20 messages
    if (memory.history.length > 20) {

        memory.history.shift();

    }

}

// ======================================
// Get Entire Memory
// ======================================

function getMemory() {

    return memory;

}

// ======================================
// Reset Memory
// ======================================

function clearMemory() {

    memory = {

        currentTable: null,

        currentColumn: null,

        currentDatatype: null,

        lastSQL: null,

        lastError: null,

        lastAction: null,

        lastIntent: null,

        previousStep: null,

        currentStep: null,

        history: []

    };

}

// ======================================
// Helpers
// ======================================

function setTable(table) {

    memory.currentTable = table;

    console.log("🧠 Current Table:", table);

}

function getTable() {

    return memory.currentTable;

}

// --------------------------------------

function setColumn(column) {

    memory.currentColumn = column;

    console.log("🧠 Current Column:", column);

}

function getColumn() {

    return memory.currentColumn;

}

// --------------------------------------

function setDatatype(type) {

    memory.currentDatatype = type;

    console.log("🧠 Current Datatype:", type);

}

function getDatatype() {

    return memory.currentDatatype;

}

// --------------------------------------

function setLastSQL(sql) {

    memory.lastSQL = sql;

    console.log("🧠 SQL Saved:");

    console.log(sql);

}

function getLastSQL() {

    return memory.lastSQL;

}

// --------------------------------------

function setLastError(error) {

    memory.lastError = error;

    console.log("🧠 Last Error:", error);

}

function getLastError() {

    return memory.lastError;

}

// --------------------------------------

function setIntent(intent) {

    memory.lastIntent = intent;

    console.log("🧠 Intent Saved:", intent);

}

function getIntent() {

    return memory.lastIntent;

}

// ======================================

module.exports = {

    update,

    addHistory,

    getMemory,

    clearMemory,

    setTable,

    getTable,

    setColumn,

    getColumn,

    setDatatype,

    getDatatype,

    setLastSQL,

    getLastSQL,

    setLastError,

    getLastError,

    setIntent,

    getIntent

};