const {
    getColumns,
    findColumn
} = require("./services/columnAnalyzer");

(async () => {

    console.log(await getColumns("students"));

    console.log(await findColumn("id"));

})();