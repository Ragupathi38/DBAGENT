const {
    getTables,
    tableExists,
    getClosestTables
} = require("./services/schemaAnalyzer");

(async () => {

    console.log(await getTables());

    console.log(await tableExists("students"));

    console.log(await tableExists("employee"));

    console.log(await getClosestTables("student"));

})();