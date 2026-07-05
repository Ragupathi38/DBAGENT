const detectIntent = require("../services/intentService");

const queryHandler = require("../handlers/queryHandler");
const schemaHandler = require("../handlers/schemaHandler");

async function askAI(req, res) {

    try {

        const question = (req.query.question || "").trim();

        if (!question) {

            return res.status(400).json({
                error: "Please enter a question."
            });

        }

        const {
    process
} = require("../engines/agentEngine");

const agent = await process(question);

const intent = agent.intent;

        console.log("Intent:", intent);

        switch (intent) {

    case "SCHEMA_CREATE":
        return await schemaHandler(question, res);

    case "DROP_TABLE":
        return await schemaHandler(question, res);

    case "DROP_COLUMN":
        return await schemaHandler(question, res);

    case "RENAME_COLUMN":
        return await schemaHandler(question, res);

    case "CHANGE_DATATYPE":
        return await schemaHandler(question, res);

    case "QUERY":
    case "DATA_INSERT":
    case "DATA_UPDATE":
    case "DATA_DELETE":
        return await queryHandler(question, res);

    default:

        return res.status(400).json({
            error: "Unsupported request."
        });

}

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: error.message
        });

    }

}

module.exports = {
    askAI
};