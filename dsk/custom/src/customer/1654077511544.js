const _ = require('underscore');
const AWS = require('aws-sdk');
const Fetch = require('node-fetch');
const Path = require('path');
const Utilities = require('../../../src/tools/utilities');
// const AppAuth = require('../../../src/libs/auth');

const processInitialStage = async (action, stage) => {
  // console.log('processInitialStage', asset, stage);

  try {
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
          objectId,
          filename,
          stage: nextStage,
        };
        const params = {
          DelaySeconds: 0,
          MessageBody: JSON.stringify(messageBody),
          QueueUrl: process.env.QUEUE_URL,
        };

        console.log('Sending SQS Message:', params);

        // const sqsClient = new AWS.SQS({
        //   region: 'us-east-1',
        // });

        // const result = await sqsClient.sendMessage(params).promise();
        // console.log('added to queue', result);
      } else {
        console.log(`Skip sending ${nextStage} Notification for Asset:`, {
          customerId,
          objectId,
          filename,
        });
      }
    }
  } catch (error) {
    console.error('Failed to process Collection and send Asset Messages', {
      asset: action,
      stage,
    }, error);
  }
};

const processAsset = async (asset) => {
  console.log('Processed Asset', asset);
};

const someBusinessLogic = async (asset, stage) => {
  console.log('I have been executed...sort of...');
  // const accountIdSecrets = JSON.parse(process.env.SECRETS);
  // await AppAuth.tenovosAuth(Fetch);

  // const response = await Utilities.getAsset(assetId, Fetch);
  // console.log(`Asset object: \nJSON.stringify(${response})`);

  // Choose Operation Based on Stage
  if (stage === 'initial') {
    await processInitialStage(asset);
  } else if (stage === 'process-asset') {
    await processAsset();
  }
};

module.exports = {
  someBusinessLogic,
};
