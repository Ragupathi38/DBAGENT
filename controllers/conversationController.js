const {
    processAnswer,
    buildCreateTableSQL
} = require("../services/conversationService");

const {
    setSQL
} = require("../storage/sqlSession");

async function continueConversation(req, res) {

    try {

        const answer = req.body.answer;

const result = await processAnswer(answer);
        // ===============================
        // Preview SQL
        // ===============================

        if (result.step === "PREVIEW") {

        const sql = buildCreateTableSQL();

            // Store SQL for Execute button
            setSQL(sql);

            return res.json({

                conversation: true,

                step: "PREVIEW",

                message: "SQL Preview Ready",

                generatedSQL: sql,

                requiresConfirmation: true

            });

        }

        return res.json({

            conversation: true,

            ...result

        });

    }

    catch (err) {

        return res.status(500).json({

            success: false,

            error: err.message

        });

    }

}

module.exports = {

    continueConversation

};