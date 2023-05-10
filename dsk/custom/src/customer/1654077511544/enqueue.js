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

  const validFileExtensions = [
    '.indd',
  ];

  // const assetIds = assets.map((asset) => asset.objectId);
  // console.log('Asset Object IDs to process', assetIds);
  const nextStage = 'process-asset';
  const processedAssetIds = [];

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

      // Add Asset to Processed Assets List
      processedAssetIds.push(objectId);
    } else {
      console.log(`Skip sending ${nextStage} Notification for Invalid Asset:`, {
        customerId,
        objectId,
        filename,
      });
    }
  }

  const bucket = process.env.CONFIG_BUCKET;

  // Upload Manifest File if any Assets were processed
  if (processedAssetIds.length) {
    const actionId = action.objectId;
    const key = `${actionId}/${collectionId}/manifest.json`;
    const body = processedAssetIds;

    // Upload Manifest File to S3
    // eslint-disable-next-line no-await-in-loop
    await Utilities.s3PutObject(bucket, key, body);
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
      const maxAttempt = 5;
      const sleepTime = 30000;
      let hasMetadata = false;
      // Loop to Get Action until Action is Indexed with Denormalized Metadata
      for (let i = 0; i < maxAttempt && !hasMetadata; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        action = await Utilities.extractAssetsFromAction(actionId);
        // Check for Denormalized Metadata, after Action is Indexed
        if (Object.keys(action.metadataDenormalized).length) {
          hasMetadata = true;
        } else {
          // eslint-disable-next-line no-await-in-loop
          await Utilities.sleep(sleepTime);
          console.log('Get Action Retry Attempt:', i + 1);
        }
      }
      if (!hasMetadata) {
        const message = 'Action is missing Denormalized Metadata';
        console.error(message, {
          actionId,
          maxAttempt,
          sleepTime,
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
