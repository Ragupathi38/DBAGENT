// ======================================
// Agent Engine
// ======================================

const detectIntent = require("../services/intentService");

const {
    addHistory,
    setIntent
} = require("./conversationMemoryEngine");

// ======================================

async function process(question) {

    const { intent } = detectIntent(question);

    setIntent(intent);

    addHistory("user", question);

    return {

        intent,

        question

    };

}

module.exports = {

    process

};