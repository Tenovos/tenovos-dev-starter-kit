const _ = require('underscore');
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

  // for (let j = 0; j < inddLinksTableMissing.length; j++) {
  //   session = await this.login(new TenovosAuth());
  //   const linkRow = inddLinksTableMissing[j];
  //   const missingLinkFilename = path.basename(linkRow.link_file_path);
  //   const missingLinkFilesize = path.basename(linkRow.link_file_size);
  //   console.log(`NEW_STRATEGY_PART_2 checking row ${missingLinkFilename}`);
  //   if (relsFileNames.includes(missingLinkFilename)) {
  //     console.log(`NEW_STRATEGY_PART_2 link already established ${missingLinkFilename}`);
  //   } else {
  //     console.log(`NEW_STRATEGY_PART_2 need to find link ${missingLinkFilename}`);
  //     const filename = missingLinkFilename.replace('-fpo.png', '');
  //     const arr = [];
  //     arr.push(`${filename} `);
  //     // also do an OR search on ABC.JPG and ABC-fpo.EXT -> filename.replaceLastInstaceOf("-fpo.", "");
  //     const data = {
  //       from: 0,
  //       searchTerm: arr,
  //       sortBy: [
  //         {
  //           metadataDefinitionId: 'createdEpoch',
  //           order: 'desc',
  //         },
  //       ],
  //       operation: 'AND',
  //       excludes: [
  //         'metadataDocument.text_content',
  //       ],
  //     };

  //     const searchResults = await this.search(arr, session, data);
  //     console.log(`Search returned ${searchResults.length} assets...`);

  //     for (let k = 0; k < searchResults.length; k += 1) {
  //       const pgCandidate = searchResults[k];
  //       const inddObjId = indd.objectId;
  //       const inddFlName = indd.filename;
  //       if (pgCandidate.filename.toLowerCase().endsWith('indd')) continue;
  //       let inddLinkGroup = '';
  //       try { inddLinkGroup = indd.technicalMetadata.image_metadata.assetLinksLinkGroup; } catch (e) { inddLinkGroup = 'unknown'; }
  //       let inddRecId = '';
  //       try { inddRecId = indd.technicalMetadata.image_metadata.recordId; } catch (e) { inddRecId = 'unknown'; }
  //       const pgObjId = pgCandidate.objectId;
  //       const pgFlName = pgCandidate.filename;
  //       let pgFlSize = '';
  //       try { pgFlSize = pgCandidate.technicalMetadata.tenovos_metadata.fileSizeInBytes; } catch (e) { pgFlSize = 'unknown'; }
  //       let pgUsedInd = '';
  //       try { pgUsedInd = pgCandidate.technicalMetadata.image_metadata.usedIn; } catch (e) { pgUsedInd = 'unknown'; }
  //       let pgLinkGroup = '';
  //       try { pgLinkGroup = pgCandidate.technicalMetadata.image_metadata.assetLinksLinkGroup; } catch (e) { pgLinkGroup = 'unknown'; }

  //       //                                    pgCandidate.filename !== 'Augmented Icon_100.ai'
  //       if (!pgCandidate || !pgCandidate.technicalMetadata || !pgCandidate.technicalMetadata.image_metadata || !pgCandidate.technicalMetadata.image_metadata.fileSize) {
  //         console.log('got it');
  //       }
  //       console.log(`NEW_STRATEGY_PART_2_CSV\t${inddObjId}\t${inddFlName}\t${inddLinkGroup}\t${inddRecId}\t${missingLinkFilename}\t${missingLinkFilesize}\tmissing\t${pgObjId}\t${pgFlName}\t${pgFlSize}\t${pgUsedInd}\t${pgLinkGroup}`);
  //     }
  //   }
  // }
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
    const { customerId, collectionId, objectId } = request;

    // Get Asset by Object ID
    const asset = await Utilities.getAsset(objectId, Fetch);
    console.log('INDD Asset:', asset);
    // Extract INDD Table Metadata

    // Extract Technical Metadata

    // Generate Asset Output JSON

    // Write Asset Output to S3
  } catch (error) {
    console.error(
      'Failed to process Asset',
      request,
      error,
    );
  }
};

const writeObjectToS3 = async (bucket, object) => {
  console.log(`AWS_PROFILE: ${process.env.AWS_PROFILE}`);
  const s3 = new AWS.S3({
    region: 'us-east-1',
  });
  console.log(`Writing to s3...${JSON.stringify(object)}`);
  s3.putObject(
    {
      Bucket: bucket,
      Key: `${object.actionId}/${object.collectionId}/${object.objectId}`,
      Body: JSON.stringify(object),
      ContentType: 'application/json',
    },
    (err, data) => {
      console.log(`${JSON.stringify(err)} ${JSON.stringify(data)}`);
    },
  );
};

module.exports = {
  someBusinessLogic,
  writeObjectToS3,
};
