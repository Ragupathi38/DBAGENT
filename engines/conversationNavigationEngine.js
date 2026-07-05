const aiService = require("../services/aiService");

// ==========================================
// Conversation Navigation Engine
// ==========================================

async function detectNavigation(conversation, userMessage) {

    const prompt = `
You are the Conversation Navigation Engine of an AI Database Agent.

Current Flow:
${conversation.flow}

Current Step:
${conversation.step}

User Message:
"${userMessage}"

Your task is to identify ONLY the user's navigation intention.

Possible Actions:

CONTINUE
BACK
CANCEL
FINISH
HELP
EDIT

Return ONLY valid JSON.

Example:

{
    "action":"BACK",
    "confidence":0.98
}

Do not explain anything.
`;

    try {

        const response = await aiService(prompt);

        let text = response.text || response;

        // Remove markdown if AI returns ```json
        text = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(text);

    }

    catch (err) {

        console.error("Navigation Engine:", err);

        return {

            action: "CONTINUE",
            confidence: 0

        };

    }

}

module.exports = {

    detectNavigation

};