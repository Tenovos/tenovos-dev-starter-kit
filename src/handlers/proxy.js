const AWS = require('aws-sdk');
const fetch = require("node-fetch");
const MessageValidator = require('sns-validator');
const validator = new MessageValidator();

async function enqueue(event) {
  console.log('Enqueuing event...');

  let parsedMessage = null;

  try {
    if (event.body) {
      let parsedBody = JSON.parse(event.body);
      parsedMessage = JSON.parse(parsedBody.Message);
    }
  } catch (e) {
    console.log('Could not parse event body', e);
  }

  if (!parsedMessage) {
    console.log('event does not have a body, not forwarding to queue');
    return;
  }

  const params = {
    DelaySeconds: 0,
    MessageBody: JSON.stringify(parsedMessage),
    QueueUrl: process.env.QUEUE_URL,
  };

  console.log(JSON.stringify(params));

  const sqsClient = new AWS.SQS({
    region: 'us-east-1',
  });

  const result = await sqsClient.sendMessage(params).promise();
  console.log('added to queue', result);
}

function isValidEvent(event) {
  console.log('Confirming event is valid');
  return new Promise(async (resolve, reject) => {
    validator.validate(event.body, function (err, message) {
      if (err) {
        console.error(err);
        resolve(false);
      }
      console.log('Confirmed event is valid');
      resolve(true);
    });
  });
}

function isConfirmationMessage(event) {
  try {
    const body = JSON.parse(event.body);
    if (body.Type === "SubscriptionConfirmation") {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

function isNotification(event) {
  try {
    const body = JSON.parse(event.body);
    if (body.Type === "Notification") {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

function confirmSubscription(event) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Confirming subscription...');
      const body = JSON.parse(event.body);
      var options = {
        method: "GET",
        url: body.SubscribeURL,
        headers: {
          'Content-Type': 'text/plain; charset=UTF-8',
        },
      };
      console.log(`Calling fetch with options ${JSON.stringify(options)}...`);
      const response = await fetch(
        options.url,
        options
      );
      console.log(`Fetch response ${JSON.stringify(response)}`);
      resolve("Done");
    } catch (e) {
      throw new Error('Failed to confirm subscription...');
    }
  });
}

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
    if (await isValidEvent(event)) {
      if (isConfirmationMessage(event)) {
        await confirmSubscription(event);
      }
      else if (isNotification(event)) {
        await enqueue(event);
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