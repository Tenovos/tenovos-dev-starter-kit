const _ = require('lodash');
const AWS = require('aws-sdk');
const Fetch = require('node-fetch');
const Path = require('path');
const Utilities = require('../../../../src/tools/utilities');
const AuthService = require('../../../../src/libs/auth');

async function sendMessage(message) {
  console.log('Enqueuing event...', message);
  // async function sendMessage(event) {
  //   console.log('Enqueuing event...', event);

  // let parsedMessage = null;

  // try {
  //   if (event.body) {
  //     const parsedBody = JSON.parse(event.body);
  //     parsedMessage = JSON.parse(parsedBody.Message);
  //     console.log('Enqueuing Event Message: ', parsedMessage);
  //   }
  // } catch (error) {
  //   console.log('Could not parse event body', {
  //     event,
  //   }, error);
  // }

  // if (!parsedMessage) {
  if (!message) {
    console.log('event does not have a body, not forwarding to queue');
    return;
  }

  const params = {
    DelaySeconds: 0,
    MessageBody: JSON.stringify(message),
    QueueUrl: process.env.QUEUE_URL,
  };

  const sqsClient = new AWS.SQS({
    region: 'us-east-1',
  });

  console.log('Sending SQS Message:', params);

  // eslint-disable-next-line no-await-in-loop
  const result = await sqsClient.sendMessage(params).promise();
  console.log('Sent Message to Queue:', result);
}
const processInitialStage = async (action) => {
  // Extract Collection ID
  const collectionId = action.metadataDenormalized.asset_identifier;
  if (!collectionId) {
    throw new Error('Missing Collection ID from Action asset_identifier');
  }

  // Get Collection
  const collection = await Utilities.getCollection(collectionId, Fetch);

  // Retrieve Assets from Collection
  const { collectionDocument } = collection;

  // Loop to Send Messages for Assets
  const chunkSize = 10;
  const fileIdChunks = _.chunk(collectionDocument, chunkSize);
  const assets = [];
  const skipFileIds = [
    '00000000-0000-0000-0000-000000000000',
  ];
  const validFileExtensions = [
    '.indd',
  ];

  for (let i = 0; i < fileIdChunks.length; i += 1) {
    const fileIdChunk = fileIdChunks[i];
    const promises = [];

    for (let j = 0; j < fileIdChunk.length; j += 1) {
      const fileId = fileIdChunk[j];
      if (!skipFileIds.includes(fileId)) {
        promises.push(Utilities.getAsset(fileId, Fetch));
      }
    }

    // eslint-disable-next-line no-await-in-loop
    const assetChunk = await Promise.all(promises);
    assets.push(...assetChunk);
  }

  // const assetIds = assets.map((asset) => asset.objectId);
  // console.log('Asset Object IDs to process', assetIds);
  const nextStage = 'process-asset';

  // Send Notifications for All Assets
  for (let i = 0; i < assets.length; i += 1) {
    const asset = assets[i];
    const { customerId, objectId, filename } = asset;

    const fileExt = Path.extname(filename.toLowerCase());

    // Only send message for Valid File Types
    if (validFileExtensions.includes(fileExt.toLowerCase())) {
      const messageBody = {
        customerId,
        actionId: action.objectId,
        collectionId,
        objectId,
        filename,
        stage: nextStage,
      };

      // eslint-disable-next-line no-await-in-loop
      await sendMessage(messageBody);

      // const params = {
      //   DelaySeconds: 0,
      //   MessageBody: JSON.stringify(messageBody),
      //   QueueUrl: process.env.QUEUE_URL,
      // };

      // const sqsClient = new AWS.SQS({
      //   region: 'us-east-1',
      // });

      // console.log('Sending SQS Message:', params);

      // // eslint-disable-next-line no-await-in-loop
      // const result = await sqsClient.sendMessage(params).promise();
      // console.log('Sent Message to Queue:', result);
    } else {
      console.log(`Skip sending ${nextStage} Notification for Asset:`, {
        customerId,
        objectId,
        filename,
      });
    }
  }
};

const enqueue = async (event) => {
  // console.log('enqueue', event);

  try {
    const body = JSON.parse(event.body);

    if (!body) {
      throw new Error('Missing Event Body');
    }
    const bodyMessage = JSON.parse(body.Message);
    const stage = Utilities.getStage(bodyMessage);
    await AuthService.setEnv();
    await AuthService.tenovosAuth(Fetch);
    let action = null;
    if (stage === 'initial') {
      const actionId = bodyMessage.data.objectId;
      const maxRetry = 10;
      let hasTechnicalMetadata = false;
      // Loop to Get Action until Action is Indexed with Technical Metadata
      for (let i = 0; i < maxRetry && !hasTechnicalMetadata; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        action = await Utilities.extractAssetsFromAction(actionId);
        // Check for Technical Metadata, after Action is Indexed
        if (Object.keys(action.technicalMetadata).length) {
          hasTechnicalMetadata = true;
        }
      }
      if (!hasTechnicalMetadata) {
        const message = 'Action is missing Technical Metadata';
        console.error(message, {
          actionId,
        });
        throw new Error(message);
      }
      await processInitialStage(action);
    } else {
      const message = JSON.parse(body.Message);
      await sendMessage(message);
    }
  } catch (error) {
    console.error('Failed to process Action', {
      event,
    }, error);
  }
};

module.exports = {
  enqueue,
};
