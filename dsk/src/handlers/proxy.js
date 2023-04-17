const AWS = require('aws-sdk');
const proxyUtilities = require('../tools/proxy-utilities');

const handler = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*'
    },
    body: 'ok',
  };

  try {
    console.log(event);
    if (await proxyUtilities.isValidEvent(event)) {
      if (proxyUtilities.isConfirmationMessage(event)) {
        await proxyUtilities.confirmSubscription(event);
        response.body = `${JSON.stringify({ message: "Successfully confirmed subscription" })}`;
      }
      else if (proxyUtilities.isNotification(event)) {
        await proxyUtilities.enqueue(event);
        response.body = `${JSON.stringify({ message: "Successfully enqueued message for processing" })}`;
      }
      else {
        throw new Error('Event appears to be invalid');
      }
    }
    else {
      throw new Error('Message appears to be invalid');
    }
  } catch (e) {
    console.log(JSON.stringify(e));
    response.statusCode = 500;
    response.body = `${JSON.stringify(e)}`;
  }
  return response;
}

module.exports.handler = handler;