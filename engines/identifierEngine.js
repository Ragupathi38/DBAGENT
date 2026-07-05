// ==========================================
// SQL Identifier Engine
// ==========================================

const RESERVED_WORDS = new Set([

    "add",
    "all",
    "alter",
    "and",
    "as",
    "between",
    "by",
    "case",
    "check",
    "column",
    "constraint",
    "create",
    "database",
    "default",
    "delete",
    "desc",
    "distinct",
    "drop",
    "else",
    "exists",
    "foreign",
    "from",
    "group",
    "having",
    "in",
    "index",
    "inner",
    "insert",
    "into",
    "is",
    "join",
    "key",
    "left",
    "like",
    "limit",
    "not",
    "null",
    "on",
    "or",
    "order",
    "outer",
    "primary",
    "references",
    "right",
    "select",
    "set",
    "table",
    "top",
    "truncate",
    "union",
    "unique",
    "update",
    "values",
    "view",
    "where"

]);

// ==========================================

function normalize(name) {

    return name.trim().toLowerCase();

}

// ==========================================

function removeInvalidCharacters(name) {

    return name.replace(/[^a-z0-9_\s]/g, "");

}

// ==========================================

function replaceSpaces(name) {

    return name.replace(/\s+/g, "_");

}

// ==========================================

function removeExtraUnderscores(name) {

    return name
        .replace(/_+/g, "_")
        .replace(/^_/, "")
        .replace(/_$/, "");

}

// ==========================================

function ensureValidStart(name) {

    if (/^[0-9]/.test(name)) {

        return "col_" + name;

    }

    return name;

}

// ==========================================

function handleReservedKeyword(name) {

    // Only if the ENTIRE identifier is a keyword
    if (RESERVED_WORDS.has(name)) {

        return name + "_col";

    }

    return name;

}

// ==========================================

function resolveDuplicates(name, existingNames) {

    let finalName = name;

    let count = 2;

    while (existingNames.includes(finalName)) {

        finalName = `${name}_${count}`;

        count++;

    }

    return finalName;

}

// ==========================================

function limitLength(name, max = 64) {

    return name.substring(0, max);

}

// ==========================================
// PUBLIC API
// ==========================================

function generateIdentifier(name, existingNames = []) {

    let sqlName = normalize(name);

    sqlName = removeInvalidCharacters(sqlName);

    sqlName = replaceSpaces(sqlName);

    sqlName = removeExtraUnderscores(sqlName);

    sqlName = ensureValidStart(sqlName);

    sqlName = handleReservedKeyword(sqlName);

    sqlName = resolveDuplicates(sqlName, existingNames);

    sqlName = limitLength(sqlName);

    return {

        displayName: name,

        sqlName

    };

}

module.exports = {

    generateIdentifier

};