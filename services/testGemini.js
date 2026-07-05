require("dotenv").config();

const askGroq = require("./services/groqService");

async function test() {

    try {

        const response = await askGroq("Say Hello Ragu");

        console.log(response);

    } catch (err) {

        console.error(err);

    }

}

test();