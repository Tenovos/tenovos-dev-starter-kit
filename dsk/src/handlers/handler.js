const custom = require("../../custom/src/custom");
const tools = require("../tools/utilities");
const appAuth = require("../libs/auth");
const fetchLocal = require("node-fetch");

exports.handler = async (event, context) => {
  console.log(`Event is of type ${typeof event}`);
  console.log(JSON.stringify(event));

  try {

    await appAuth.setEnv();

    for (let index = 0; index < event.Records.length; index++) {
      const bodyString = event.Records[index].body;
      const body = JSON.parse(bodyString);

      if (!event) throw new Error();
      const stage = tools.getStage(body);
      await appAuth.tenevosAuth(fetchLocal);
      if (stage === "initial") {
        const response = await tools.extractAssetsFromAction(body.data.objectId);
        console.log(JSON.stringify(response));
      }
      const theResponse = tools.getApiEventType(body);
      if (theResponse) {
        await custom.someBusinessLogic(body.customerId, body.data.objectId);
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
