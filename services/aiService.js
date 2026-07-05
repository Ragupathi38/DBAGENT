const askGemini = require("./geminiService");
const askGroq = require("./groqService");

async function aiService(prompt) {

    // Try Gemini first
    try {

        console.log("🤖 Trying Gemini...");

        let sql = await askGemini(prompt);

        sql = sql
            .replace(/```sql/g, "")
            .replace(/```/g, "")
            .trim();

        return {
            provider: "Gemini",
            fallback: false,
            sql
        };

    } catch (error) {

        console.log("❌ Gemini Failed");

        const message = JSON.stringify(error);

        // If Gemini quota/rate limit error -> use Groq
        if (
            message.includes("429") ||
            message.includes("RESOURCE_EXHAUSTED") ||
            message.toLowerCase().includes("quota")
        ) {

            console.log("🚀 Switching to Groq...");

            let sql = await askGroq(prompt);

            sql = sql
                .replace(/```sql/g, "")
                .replace(/```/g, "")
                .trim();

            return {
                provider: "Groq",
                fallback: true,
                sql
            };
        }

        // Other Gemini errors
        throw error;
    }
}

module.exports = aiService;