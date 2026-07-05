require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function test() {

    const prompt = `
You are an SQL Expert.

Rules:
1. Return ONLY SQL.
2. No explanation.
3. No markdown.

User Question:
Show all students.
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    console.log(response.text);

}

test();