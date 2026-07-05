// ======================================
// Undo Engine
// ======================================

let lastAction = null;

// =============================

function saveAction(action) {

    lastAction = action;

}

// =============================

function getLastAction() {

    return lastAction;

}

// =============================

function clearAction() {

    lastAction = null;

}

// =============================

module.exports = {

    saveAction,

    getLastAction,

    clearAction

};