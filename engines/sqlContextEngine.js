// ======================================
// SQL Context Engine
// ======================================

function extractContext(sql) {

    sql = sql.trim();

    const context = {

        operation: null,
        table: null,
        columns: [],
        values: [],
        where: null,
        rawSQL: sql

    };

    let match;

    // ======================================
    // CREATE TABLE
    // ======================================

    match = sql.match(/CREATE\s+TABLE\s+`?([a-zA-Z0-9_]+)`?/i);

    if (match) {

        context.operation = "CREATE";
        context.table = match[1];

        return context;

    }

    // ======================================
    // INSERT (WITH COLUMN LIST)
    // ======================================

    match = sql.match(
        /INSERT\s+INTO\s+`?([a-zA-Z0-9_]+)`?\s*\((.*?)\)\s*VALUES\s*\((.*?)\)/is
    );

    if (match) {

        context.operation = "INSERT";
        context.table = match[1];

        context.columns = match[2]
            .split(",")
            .map(c => c.trim().replace(/`/g, ""));

        context.values = match[3]
            .split(",")
            .map(v => v.trim());

        return context;

    }

    // ======================================
    // INSERT (WITHOUT COLUMN LIST)
    // ======================================

    match = sql.match(
        /INSERT\s+INTO\s+`?([a-zA-Z0-9_]+)`?\s*VALUES\s*\((.*?)\)/is
    );

    if (match) {

        context.operation = "INSERT";
        context.table = match[1];

        context.values = match[2]
            .split(",")
            .map(v => v.trim());

        return context;

    }

    // ======================================
    // SELECT
    // ======================================

    match = sql.match(/FROM\s+`?([a-zA-Z0-9_]+)`?/i);

    if (sql.toUpperCase().startsWith("SELECT") && match) {

        context.operation = "SELECT";
        context.table = match[1];

        return context;

    }

    // ======================================
// UPDATE
// ======================================

match = sql.match(
    /UPDATE\s+`?([a-zA-Z0-9_]+)`?.*?WHERE\s+(.+)$/is
);

if (match) {

    context.operation = "UPDATE";

    context.table = match[1];

    context.where = match[2].trim();

    return context;

}
   // ======================================
// DELETE
// ======================================

match = sql.match(
    /DELETE\s+FROM\s+`?([a-zA-Z0-9_]+)`?\s+WHERE\s+(.+)$/is
);

if (match) {

    context.operation = "DELETE";

    context.table = match[1];

    context.where = match[2].trim();

    return context;

}

    // ======================================
    // ALTER
    // ======================================

    match = sql.match(/ALTER\s+TABLE\s+`?([a-zA-Z0-9_]+)`?/i);

    if (match) {

        context.operation = "ALTER";
        context.table = match[1];

        return context;

    }

    return context;

}

module.exports = {

    extractContext

};