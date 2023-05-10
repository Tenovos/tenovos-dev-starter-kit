const FetchLocal = require('node-fetch');
const Custom = require('../../custom/src/custom');
const Tools = require('../tools/utilities');
const AppAuth = require('../libs/auth');

exports.handler = async (event, context) => {
  console.log(`Event is of type ${typeof event}`);
  console.log('ENTER_SERVICE', JSON.stringify(event));

  let response = null;

  try {
    await AppAuth.setEnv();

    // let isDone = false;
    // for (let index = 0; index < event.Records.length && !isDone; index += 1) {
    if (event.Records.length) {
      // const bodyString = event.Records[index].body;
      const bodyString = event.Records[0].body;
      const body = JSON.parse(bodyString);

      if (!event) throw new Error();
      const stage = Tools.getStage(body);
      await AppAuth.tenovosAuth(FetchLocal);
      let action = null;
      if (stage === 'initial') {
        action = await Tools.extractAssetsFromAction(body.data.objectId);
      } else if (stage === 'process-asset') {
        action = body;
      }
      // const theResponse = Tools.getApiEventType(body);
      // if (theResponse) {
      await Custom.someBusinessLogic(body.customerId, action, stage);
      // } else {
      // throw new Error();
      // }

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
    console.error('Failed to Process Event', event, error);
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
