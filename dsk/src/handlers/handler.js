const app = require("../app");
const tools = require("../tools/utilities");
// const config = require("../../config/config.json");
const appAuth = require("../libs/auth");

// const handler = async function handler(event, context) {
exports.handler = async (event, context) => {
  console.log("Lambda executed successfully");
  console.log("typeof event is: " + typeof event);
  console.log(JSON.stringify(event));

  await appAuth.setEnv();

  for (let index = 0; index < event.Records.length; index++) {
    const bodyString = event.Records[index].body;
    const body = JSON.parse(bodyString);

    try {
      if (!event) throw new Error();
      const theResponse = tools.getApiEventType(body);
      // console.log(`the response is ${theResponse}`);
      if (theResponse) {
        await someBusinessLogic(body.data.objectId);
      } else {
        throw new Error();
      }
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "lambda executed" }),
        headers: { "content-type": "application/json" },
      };
    } catch (e) {
      console.log(e);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "error processing" }),
        headers: { "content-type": "application/json" },
      };
    }
  }
};
