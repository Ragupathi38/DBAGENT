const {
    getMemory
} = require("../engines/conversationMemoryEngine");

function showMemory(req, res) {

    res.json(getMemory());

}

module.exports = {

    showMemory

};