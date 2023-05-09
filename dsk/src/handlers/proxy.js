// const Custom = require('../../custom/src/custom');
const ProxyUtilities = require('../tools/proxy-utilities');

const handler = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
    },
    body: 'ok',
  };

  try {
    console.log('Event:', event);
    if (await ProxyUtilities.isValidEvent(event)) {
      if (ProxyUtilities.isConfirmationMessage(event)) {
        await ProxyUtilities.confirmSubscription(event);
        response.body = `${JSON.stringify({
          message: 'Successfully confirmed subscription',
        })}`;
      } else if (ProxyUtilities.isNotification(event)) {
        await ProxyUtilities.enqueue(event);
        response.body = `${JSON.stringify({
          message: 'Successfully enqueued message for processing',
        })}`;
      } else {
        throw new Error('Event appears to be invalid');
      }
    } else {
      throw new Error('Message appears to be invalid');
    }
  } catch (error) {
    console.error(error);
    response.statusCode = 500;
    response.body = `${JSON.stringify({
      message: error.message,
    })}`;
  }
  return response;
};

module.exports = {
  handler,
};
