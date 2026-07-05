const validateSQL = require("./services/sqlValidator");

console.log(validateSQL("SELECT * FROM students"));
console.log(validateSQL("DELETE FROM students"));
console.log(validateSQL("DROP TABLE students"));
console.log(validateSQL("UPDATE students SET age=20"));