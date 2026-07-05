let conversation = null;

function getConversation() {
    return conversation;
}

function setConversation(data) {
    conversation = data;
}

function clearConversation() {
    conversation = null;
}

module.exports = {
    getConversation,
    setConversation,
    clearConversation
};