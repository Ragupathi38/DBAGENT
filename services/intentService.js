function detectIntent(message) {

    const text = message.toLowerCase().trim();

    // ===========================
    // CREATE TABLE
    // ===========================

    if (
        text.startsWith("create table") ||
        text.startsWith("make table") ||
        text.startsWith("new table")
    ) {

        return {

            intent: "SCHEMA_CREATE"

        };

    }

    // ===========================
    // DROP TABLE
    // ===========================

    if (

        text.startsWith("delete table") ||

        text.startsWith("drop table") ||

        text.startsWith("remove table")

    ) {

        return {

            intent: "DROP_TABLE"

        };

    }

    // ===========================
    // DROP COLUMN
    // ===========================

    if (

        text.startsWith("delete column") ||

        text.startsWith("drop column") ||

        text.startsWith("remove column")

    ) {

        return {

            intent: "DROP_COLUMN"

        };

    }

    // ===========================
    // RENAME COLUMN
    // ===========================

    if (

        text.includes("rename column")

    ) {

        return {

            intent: "RENAME_COLUMN"

        };

    }

    // ===========================
    // CHANGE DATATYPE
    // ===========================

    if (

        text.includes("change datatype") ||

        text.includes("change type") ||

        text.includes("modify datatype")

    ) {

        return {

            intent: "CHANGE_DATATYPE"

        };

    }

    // ===========================
    // INSERT
    // ===========================

    if (

        text.startsWith("add") ||

        text.startsWith("insert")

    ) {

        return {

            intent: "DATA_INSERT"

        };

    }

    // ===========================
    // UPDATE DATA
    // ===========================

    if (

        text.startsWith("update") ||

        text.startsWith("modify") ||

        text.startsWith("change")

    ) {

        return {

            intent: "DATA_UPDATE"

        };

    }

    // ===========================
    // DELETE DATA
    // ===========================

    if (

    text.startsWith("remove column") ||

        text.startsWith("remove table")

    ) {

        return {

            intent: "DATA_DELETE"

        };

    }

    // ===========================
    // DEFAULT
    // ===========================

    return {

        intent: "QUERY"

    };

}

module.exports = detectIntent;
