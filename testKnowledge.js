const {

    loadKnowledge,

    getKnowledge,

    findTable,

    findColumn,

    getSuggestions

} = require("./services/databaseKnowledge");

(async () => {

    await loadKnowledge();

    console.log("Knowledge:");
    console.log(getKnowledge());

    console.log("\nFind Table:");
    console.log(findTable("student"));

    console.log("\nFind Column:");
    console.log(findColumn("id"));

    console.log("\nSuggestions:");
    console.log(getSuggestions("stud"));

})();