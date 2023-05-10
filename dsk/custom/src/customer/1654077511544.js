const _ = require('lodash');
const AWS = require('aws-sdk');
const Fetch = require('node-fetch');
const Path = require('path');
const Utilities = require('../../../src/tools/utilities');
// const AppAuth = require('../../../src/libs/auth');

// const processInitialStage = async (action, stage) => {
//   // console.log('processInitialStage', asset, stage);

//   try {
//     // Extract Collection ID
//     const collectionId = action.metadataDenormalized.asset_identifier;
//     if (!collectionId) {
//       throw new Error('Missing Collection ID from Action asset_identifier');
//     }

//     // Get Collection
//     const collection = await Utilities.getCollection(collectionId, Fetch);

//     // Retrieve Assets from Collection
//     const { collectionDocument } = collection;

//     // Loop to Send Messages for Assets
//     const chunkSize = 10;
//     const fileIdChunks = _.chunk(collectionDocument, chunkSize);
//     const assets = [];
//     const skipFileIds = [
//       '00000000-0000-0000-0000-000000000000',
//     ];
//     const validFileExtensions = [
//       '.indd',
//     ];

//     for (let i = 0; i < fileIdChunks.length; i += 1) {
//       const fileIdChunk = fileIdChunks[i];
//       const promises = [];

//       for (let j = 0; j < fileIdChunk.length; j += 1) {
//         const fileId = fileIdChunk[j];
//         if (!skipFileIds.includes(fileId)) {
//           promises.push(Utilities.getAsset(fileId, Fetch));
//         }
//       }

//       // eslint-disable-next-line no-await-in-loop
//       const assetChunk = await Promise.all(promises);
//       assets.push(...assetChunk);
//     }

//     // const assetIds = assets.map((asset) => asset.objectId);
//     // console.log('Asset Object IDs to process', assetIds);
//     const nextStage = 'process-asset';

//     // Send Notifications for All Assets
//     for (let i = 0; i < assets.length; i += 1) {
//       const asset = assets[i];
//       const { customerId, objectId, filename } = asset;

//       const fileExt = Path.extname(filename.toLowerCase());

//       // Only send message for Valid File Types
//       if (validFileExtensions.includes(fileExt.toLowerCase())) {
//         const messageBody = {
//           customerId,
//           objectId,
//           filename,
//           stage: nextStage,
//         };
//         const params = {
//           DelaySeconds: 0,
//           MessageBody: JSON.stringify(messageBody),
//           QueueUrl: process.env.QUEUE_URL,
//         };

//         console.log('Sending SQS Message:', params);

//         // const sqsClient = new AWS.SQS({
//         //   region: 'us-east-1',
//         // });

//         // const result = await sqsClient.sendMessage(params).promise();
//         // console.log('added to queue', result);
//       } else {
//         console.log(`Skip sending ${nextStage} Notification for Asset:`, {
//           customerId,
//           objectId,
//           filename,
//         });
//       }
//     }
//   } catch (error) {
//     console.error('Failed to process Collection and send Asset Messages', {
//       asset: action,
//       stage,
//     }, error);
//   }
// };

const processAsset = async (asset) => {
  console.log('Processing Asset', asset.objectId);

  const missingLinks = [];

  try {
    // Extract INDD Table Metadata
    const inddLinksTableMissing = asset.metadataDenormalized.system_layout_links;

    for (let i = 0; i < inddLinksTableMissing.length; i += 1) {
      const linkRow = inddLinksTableMissing[i];

      const missingLinkFilename = Path.basename(linkRow.link_file_path);
      const missingLinkFilesize = Path.basename(linkRow.link_file_size);
      console.log(`Checking Entry ${missingLinkFilename}`);
      // if (relsFileNames.includes(missingLinkFilename)) {
      if (linkRow.link_file_status !== 'MISSING') {
        console.log(`Link already established ${missingLinkFilename}`);
      } else {
        console.log(`Need to find link for ${missingLinkFilename}`);
        const filename = missingLinkFilename.replace('-fpo.png', '');
        const searchTerm = [];
        searchTerm.push(`${filename} `);
        // also do an OR search on ABC.JPG and ABC-fpo.EXT -> filename.replaceLastInstaceOf("-fpo.", "");
        const searchOptions = {
          excludes: [
            'metadataDocument.text_content',
            'technicalMetadata',
          ],
        };

        // Search for Placed Graphic Assets
        // eslint-disable-next-line no-await-in-loop
        const searchResults = await Utilities.runKeywordSearch(searchTerm, searchOptions, Fetch);
        const { result } = searchResults;
        console.log(`Search returned ${result.length} Assets`);

        // Loop to Extract Missing Links
        for (let j = 0; j < result.length; j += 1) {
          const pgAsset = result[j];
          let skipAsset = false;

          const inddObjId = asset.objectId;
          const inddFilename = asset.filename;
          if (pgAsset.filename.toLowerCase().endsWith('indd')) {
            skipAsset = true;
          }
          const inddLinkGroup = _.get(asset, 'technicalMetadata.image_metadata.assetLinksLinkGroup', 'unknown');
          const inddRecId = _.get(asset, 'technicalMetadata.image_metadata.recordId', 'unknown');
          const pgObjId = pgAsset.objectId;
          const pgFlName = pgAsset.filename;
          const pgFlSize = _.get(pgAsset, 'technicalMetadata.tenovos_metadata.fileSizeInBytes', 'unknown');
          const pgUsedInd = _.get(pgAsset, 'technicalMetadata.image_metadata.usedIn', 'unknown');
          const pgLinkGroup = _.get(pgAsset, 'technicalMetadata.image_metadata.assetLinksLinkGroup', 'unknown');

          // pgCandidate.filename !== 'Augmented Icon_100.ai'
          // if (!pgAsset || !pgAsset.technicalMetadata || !pgAsset.technicalMetadata.image_metadata
          //   || !pgAsset.technicalMetadata.image_metadata.fileSize) {
          //   console.log('Got It');
          // }
          if (!skipAsset) {
            const missingLink = `${inddObjId}\t${inddFilename}\t${inddLinkGroup}\t${inddRecId}\t${missingLinkFilename}`
              + `\t${missingLinkFilesize}\tmissing\t${pgObjId}\t${pgFlName}\t${pgFlSize}\t${pgUsedInd}\t${pgLinkGroup}`;
            missingLinks.push(missingLink);
          }
        }
      }
    }
  } catch (error) {
    console.error('Failed to Process Asset and Extract Missing Links', asset, error);
    throw error;
  }

  console.log('Missing Links', missingLinks);

  return missingLinks;
};

const writeObjectToS3 = async (bucket, object) => new Promise((resolve, reject) => {
  const { actionId, collectionId, objectId } = object;

  console.log(`AWS_PROFILE: ${process.env.AWS_PROFILE}`);
  const s3 = new AWS.S3({
    region: 'us-east-1',
  });
  const params = {
    Bucket: bucket,
    Key: `${actionId}/${collectionId}/${objectId}.json`,
    Body: JSON.stringify(object),
    ContentType: 'application/json',
  };
  console.log('Writing to s3', params);
  s3.putObject(
    params,
    (error, data) => {
      if (error) {
        const message = 'Failed to Upload Object to S3';
        console.error(message, {
          bucket,
          actionId,
          collectionId,
          objectId,
        }, JSON.stringify(error));
        reject(new Error(message));
      } else {
        console.log('Uploaded Object to S3:', {
          bucket,
          actionId,
          collectionId,
          objectId,
        }, JSON.stringify(data));
        resolve(data);
      }
    },
  );
});

const uploadMissingLinks = async (request, missingLinks) => {
  const { actionId, collectionId, objectId } = request;
  const bucket = process.env.CONFIG_BUCKET;
  const params = {
    actionId,
    collectionId,
    objectId,
    csv: missingLinks,
  };
  await writeObjectToS3(bucket, params);
  console.log('Completed Upload of Missing Links for Asset', {
    actionId,
    collectionId,
    objectId,
  });
};

const someBusinessLogic = async (request, stage) => {
  console.log('Proces Custom Logic for Asset', {
    request,
    stage,
  });
  // const accountIdSecrets = JSON.parse(process.env.SECRETS);
  // await AppAuth.tenovosAuth(Fetch);

  // const response = await Utilities.getAsset(assetId, Fetch);
  // console.log(`Asset object: \nJSON.stringify(${response})`);

  // Choose Operation Based on Stage
  // if (stage === 'initial') {
  //   await processInitialStage(asset);
  // } else if (stage === 'process-asset') {
  // await processAsset(request);
  // }

  try {
    const { objectId } = request;

    // Get Asset by Object ID
    const asset = await Utilities.getAsset(objectId, Fetch);
    console.log('INDD Asset:', asset);

    // Process Asset to Generate Missing Links JSON
    const missingLinks = await processAsset(asset);

    // Upload Missing Links to S3
    await uploadMissingLinks(request, missingLinks);

    // Write Asset Output to S3
  } catch (error) {
    console.error(
      'Failed to process Asset',
      request,
      error,
    );
  }
};

module.exports = {
  someBusinessLogic,
};
