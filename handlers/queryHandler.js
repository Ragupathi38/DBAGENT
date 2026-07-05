const {
    validateTable
} = require("../services/validationService");
const {
    findTable,
    getKnowledge
} = require("../services/databaseKnowledge");
const aiService = require("../services/aiService");
const getSchema = require("../services/schemaService");
const validateSQL = require("../services/sqlValidator");
const { buildQueryPrompt } = require("../services/promptService");
const db = require("../config/db");

const {
    setPendingSQL
} = require("../storage/pendingQuery");

async function queryHandler(question, res) {

    try {

        // Get current database schema
        // ==========================================
const lowerQuestion = question.toLowerCase();

// =====================================
// Validate Explicit Table Names
// =====================================

const patterns = [

    /\bfrom\s+([a-zA-Z_][a-zA-Z0-9_]*)/i,

    /\binto\s+([a-zA-Z_][a-zA-Z0-9_]*)/i,

    /\bdescribe\s+([a-zA-Z_][a-zA-Z0-9_]*)/i,

    /\bdesc\s+([a-zA-Z_][a-zA-Z0-9_]*)/i

];

for (const pattern of patterns) {

    const match = question.match(pattern);

    if (match) {

        const validation = validateTable(match[1]);

        if (!validation.success) {

            return res.status(400).json({

                error: validation.message

            });

        }

    }

}

// ==========================================

// Get current database schema
const schema = await getSchema();
        // Build AI prompt
        const prompt = buildQueryPrompt(schema, question);

        // Generate SQL
        const aiResponse = await aiService(prompt);

        const sql = aiResponse.sql.trim();

        console.log("Provider :", aiResponse.provider);
        console.log("SQL :", sql);

        // Validate SQL
        const validation = validateSQL(sql);

        if (!validation.valid) {

            return res.status(400).json({

                provider: aiResponse.provider,

                fallback: aiResponse.fallback,

                generatedSQL: sql,

                error: validation.reason

            });

        }

        // INSERT / UPDATE / DELETE
        if (validation.requiresConfirmation) {

            setPendingSQL(sql);

            return res.json({

                provider: aiResponse.provider,

                fallback: aiResponse.fallback,

                generatedSQL: sql,

                requiresConfirmation: true,

                message:
                    "Confirmation required before executing this query."

            });

        }

        // SELECT / SHOW / DESCRIBE
        db.query(sql, (err, result) => {

            if (err) {

                return res.status(500).json({

                    provider: aiResponse.provider,

                    fallback: aiResponse.fallback,

                    generatedSQL: sql,

                    error: err.message

                });

            }

            return res.json({

                provider: aiResponse.provider,

                fallback: aiResponse.fallback,

                currentDatabase: process.env.DB_NAME,

                generatedSQL: sql,

                requiresConfirmation: false,

                data: result

            });

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            error: error.message

        });

    }

}

module.exports = queryHandler;