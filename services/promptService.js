function buildQueryPrompt(schema, question) {

    return `
You are an expert MySQL SQL Generator.

Database Schema:

${schema}

Rules:

1. Return ONLY SQL.
2. No explanation.
3. No markdown.
4. Use ONLY tables and columns from the schema.
5. Never guess table or column names.
6. If the user asks something impossible, return the closest valid SQL.

User Question:

${question}
`;

}

module.exports = {
    buildQueryPrompt
};

