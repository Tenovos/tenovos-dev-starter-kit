const AWS = require('aws-sdk');
const Fetch = require('node-fetch');
const Utilities = require('../../../../src/tools/utilities');

async function enqueue(event) {
  console.log('Enqueuing event...', event);

  let parsedMessage = null;

  try {
    if (event.body) {
      const parsedBody = JSON.parse(event.body);
      parsedMessage = JSON.parse(parsedBody.Message);
      console.log('Enqueuing Event Message: ', parsedMessage);

      // Extract Collection ID
      const collectionId = parsedMessage;
      // Get Collection
      const collection = await Utilities.getCollection(Fetch, collectionId);
      // Extract Assets from Collection
      // Send Messages for Assets
    }
  } catch (error) {
    console.log('Could not parse event body', {
      event,
    }, error);
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

  console.log('Skip added to queue');

  // const sqsClient = new AWS.SQS({
  //   region: 'us-east-1',
  // });

  // const result = await sqsClient.sendMessage(params).promise();
  // console.log('added to queue', result);
}

module.exports = {
  enqueue,
};
