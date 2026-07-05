const {
    getDatabaseInfo
} = require("../services/databaseExplorerService");

async function getDatabase(req, res) {

    try {

        const info = await getDatabaseInfo();

        return res.json(info);

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            error: error.message

        });

    }

}

module.exports = {

    getDatabase

};