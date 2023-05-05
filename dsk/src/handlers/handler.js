const app = require("../../custom/src/custom");
const tools = require("../tools/utilities");
const appAuth = require("../libs/auth");

exports.handler = async (event, context) => {
  console.log(`Event is of type ${typeof event}`);
  console.log(JSON.stringify(event));

  try {

    await appAuth.setEnv();

    for (let index = 0; index < event.Records.length; index++) {
      const bodyString = event.Records[index].body;
      const body = JSON.parse(bodyString);

      if (!event) throw new Error();
      const theResponse = tools.getApiEventType(body);
      if (theResponse) {
        await app.someBusinessLogic(body.data.objectId);
      } else {
        throw new Error();
      }
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "lambda executed" }),
        headers: { "content-type": "application/json" },
      };
    }
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "error processing" }),
      headers: { "content-type": "application/json" },
    };
  }
};
