// ======================================
// Column Editor Engine
// ======================================

function editColumnName(columns, index, newName) {

    columns[index].displayName = newName;
    columns[index].sqlName = newName
        .toLowerCase()
        .replace(/\s+/g, "_");

    return columns;

}

// ======================================

function editDatatype(columns, index, newDatatype) {

    columns[index].type = newDatatype;

    return columns;

}

// ======================================

function deleteColumn(columns, index) {

    columns.splice(index, 1);

    return columns;

}

// ======================================

function addColumn(columns, column) {

    columns.push(column);

    return columns;

}

// ======================================

function moveColumn(columns, from, to) {

    const temp = columns.splice(from, 1)[0];

    columns.splice(to, 0, temp);

    return columns;

}

// ======================================

module.exports = {

    editColumnName,

    editDatatype,

    deleteColumn,

    addColumn,

    moveColumn

};