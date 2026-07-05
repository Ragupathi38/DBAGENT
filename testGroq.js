require("dotenv").config();

const askGroq = require("./services/groqService");

async function test() {

    try {

        const response = await askGroq(`
You are an SQL generator.

Return ONLY SQL.

Question:
Show all students
`);

        console.log(response);

    } catch (error) {

        console.error(error);

    }

}

test();