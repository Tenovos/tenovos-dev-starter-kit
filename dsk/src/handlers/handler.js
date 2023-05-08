const fetchLocal = require('node-fetch');
const custom = require('../../custom/src/custom');
const tools = require('../tools/utilities');
const appAuth = require('../libs/auth');

exports.handler = async (event, context) => {
  console.log(`Event is of type ${typeof event}`);
  console.log(JSON.stringify(event));

  let response = null;

  try {
    await appAuth.setEnv();

    // let isDone = false;
    // for (let index = 0; index < event.Records.length && !isDone; index += 1) {
    if (event.Records.length) {
      // const bodyString = event.Records[index].body;
      const bodyString = event.Records[0].body;
      const body = JSON.parse(bodyString);

      if (!event) throw new Error();
      const stage = tools.getStage(body);
      await appAuth.tenevosAuth(fetchLocal);
      if (stage === 'initial') {
        response = await tools.extractAssetsFromAction(body.data.objectId);
        console.log(JSON.stringify(response));
      }
      const theResponse = tools.getApiEventType(body);
      if (theResponse) {
        await custom.someBusinessLogic(body.customerId, body.data.objectId);
      } else {
        throw new Error();
      }

      response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'lambda executed',
        }),
        headers: {
          'content-type': 'application/json',
        },
      };

      // isDone = true;
    } else {
      response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'No Records to process',
        }),
        headers: {
          'content-type': 'application/json',
        },
      };
    }
  } catch (error) {
    console.error(error);
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'error processing',
      }),
      headers: {
        'content-type': 'application/json',
      },
    };
  }

  return response;
};
