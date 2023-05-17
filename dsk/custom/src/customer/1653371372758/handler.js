const _ = require('lodash');
const AWS = require('aws-sdk');
const Fetch = require('node-fetch');
const Path = require('path');
const Utilities = require('../../../../src/tools/utilities');

function search(vals, dataOverride, limit) {
  console.log(`entered search...vals are ${vals}`);
  console.log('ABCDEFJHI');
  const values = JSON.parse(JSON.stringify(vals));
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      //            values.push("-migration_batch_search_key:TROUBLESHOOTING");
      const data = (!dataOverride) ? {
        from: 0,
        searchTerm: values,
        sortBy: [
          {
            metadataDefinitionId: 'createdEpoch',
            order: 'desc',
          },
        ],
        operation: 'OR',
        excludes: [
          'metadataDocument.text_content',
        ],
      } : dataOverride;

      const apiSearchRequestBody = {
        //        apiURL: this.config.apiUrl,
        //        apiKey: this.config.apiKey,
        accessToken: 'ignore',
        authorization: 'ignore',
        payload: data,
      };

      let allAssets = [];
      const pagesize = 50;
      let assetCount = 0;
      do {
        // eslint-disable-next-line no-await-in-loop
        const a = await Utilities.runKeywordSearch(data.searchTerm, data, Fetch);

        //        const a = await apiService.search(apiSearchRequestBody);
        const assets = a;
        assetCount = assets.result.length;
        // eslint-disable-next-line max-len
        console.log(`Search returned asset count ${assetCount} with from of ${apiSearchRequestBody.payload.from} and num values of ${values.length}`);
        if (assets.result.length > 0) {
          allAssets = allAssets.concat(assets.result);
          apiSearchRequestBody.payload.from += 50;
          if (limit && allAssets.length >= limit) {
            break;
          }
          if (assets.totalCount === allAssets.length) {
            break;
          }
        } else {
          break;
        }
      } while (assetCount === pagesize);
      // const resultsArr = allAssets;
      // for (let i = 0; i < values.length; i++) {
      //   const value = values[i].substring(0, values[i].length - 1); // remove space for search work around
      //   if (this.searchMap[value] === undefined) {
      //     this.searchMap[value] = {
      //       count: 0,
      //       path: value,
      //     };
      //   }
      //   for (let j = 0; j < resultsArr.length; j++) {
      //     const resultStr = JSON.stringify(resultsArr[j]);
      //     //                        const relationships = await this.getRelationships(resultsArr[j].objectId, session);
      //     //                        const versions = await this.getVersions(resultsArr[j].objectId, session);

      //     if (resultStr.indexOf(value) > -1) {
      //       const fn = path.basename(value);
      //       this.searchMap[value].count += 1;
      //       this.searchMap[value].path = value;
      //       this.searchMap[value].objectId = resultsArr[j].objectId;
      //       this.searchMap[value].fileId = resultsArr[j].fileId;
      //       this.searchMap[value].originalFileId = resultsArr[j].originalFileId;
      //       this.searchMap[value].filename = resultsArr[j].filename || 'N/A';
      //       this.searchMap[value].fnMatches = (fn === resultsArr[j].filename) ? 'Yes' : 'No';
      //       this.searchMap[value].renditions = (resultsArr[j].renditions && resultsArr[j].imageThumb && resultsArr[j].imageThumb.indexOf('/web/asset/') > -1 ? 'No' : 'Yes');
      //     }
      //   }
      // }
      if (allAssets) { resolve(allAssets); } else { resolve([]); }
    } catch (error) {
      console.error('Error in search: ', error);
      reject(new Error(`Error ${error}`));
    }
  });
}

const processAsset = async (asset) => {
  console.log('Processing Asset', asset.objectId);

  const missingLinks = [];

  try {
    // Extract INDD Table Metadata
    const inddLinksTableMissing = asset.metadataDenormalized.system_layout_links;

    if (!asset.metadataDenormalized || asset.metadataDenormalized === {} || asset.fileState === 'recycle bin') {
      console.log(`Asset either in recycle bin or missing denormalized metadata [${JSON.stringify(asset)}]`);
      return missingLinks;
    }
    for (let i = 0; i < inddLinksTableMissing.length; i += 1) {
      const linkRow = inddLinksTableMissing[i];
      let linkStatus = 'missing';
      try {
        const missingLinkFilename = Path.basename(linkRow.link_file_path);
        const missingLinkFilesize = linkRow.link_file_size;
        console.log(`Checking Entry ${missingLinkFilename}`);
        // if (relsFileNames.includes(missingLinkFilename)) {
        if (linkRow.link_file_status !== 'MISSING') {
          console.log(`Link already established ${missingLinkFilename}`);
        } else {
          console.log(`Need to find link for ${missingLinkFilename}`);
          const searchTerm = [];
          const filename = missingLinkFilename.replace('-fpo.png', '');
          searchTerm.push(`"filename: ${filename} "`);
          if (missingLinkFilename !== filename) { searchTerm.push(`"filename: ${missingLinkFilename} "`); }

          // also do an OR search on ABC.JPG and ABC-fpo.EXT -> filename.replaceLastInstaceOf("-fpo.", "");
          // const searchOptions = {
          //   excludes: [
          //     'metadataDocument.text_content',
          //     'technicalMetadataDocument',
          //   ],
          // };

          // Check to Search for Unconfirmed Assets
          let pgUnconfirmedObjectIds = [];
          try {
            // Check for Uncomfirmed Object IDs
            pgUnconfirmedObjectIds = JSON.parse(
              _.get(linkRow, 'link_unconfirmed_object_ids', '[]'),
            );
            // Retrieve Unconfirmed Assets
            if (Array.isArray(pgUnconfirmedObjectIds) && pgUnconfirmedObjectIds.length) {
              linkStatus = 'unconfirmed';
              // searchTerm.push(pgUnconfirmedObjectIds);
            }
          } catch (error) {
            console.error('Failed to extract Unconfirmed Links from Asset', {
              objectId: asset.objectId,
            });
          }

          // Search for Placed Graphic Assets
          let searchResults = [];
          if (linkStatus === 'missing') {
            // eslint-disable-next-line no-await-in-loop
            searchResults = await search(searchTerm, false, 50);
            // Use Unknown Asset if no Assets found
            if (!searchResults.length) {
              const unknownAsset = {
                objectId: 'unknown',
                filename: missingLinkFilename,
              };
              searchResults.push(unknownAsset);
            }
          } else if (linkStatus === 'unconfirmed') {
            for (let x = 0; x < pgUnconfirmedObjectIds.length; x += 1) {
              searchResults.push(
                {
                  objectId: pgUnconfirmedObjectIds[x],
                  filename: missingLinkFilename,
                },
              );
            }
          }
          const result = searchResults;
          console.log(`Search returned ${result.length} Assets`);

          // Loop to Extract Missing Links
          for (let j = 0; j < result.length; j += 1) {
            const pgAsset = result[j];
            let skipAsset = false;

            // Skip Linked INDD Files
            if (pgAsset.filename !== missingLinkFilename && !pgAsset.filename.startsWith(filename)) {
              skipAsset = true;
            }

            const inddObjId = asset.objectId;
            const inddFilename = asset.filename;
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

            // Add Missing Link if Not Skipping Asset
            if (!skipAsset) {
              const missingLink = `${inddObjId}\t${inddFilename}\t${inddLinkGroup}\t${inddRecId}`
                + `\t${missingLinkFilename}\t${missingLinkFilesize}\t${linkStatus}\t${pgObjId}\t${pgFlName}`
                + `\t${pgFlSize}\t${pgUsedInd}\t${pgLinkGroup}`;

              // Add Missing Link to List
              missingLinks.push(missingLink);
            }
          }
        }
      } catch (e) {
        console.error('Failed to process row', {
          objectId: asset.objectId,
          linkRow,
        }, e);
      }
    }
  } catch (error) {
    console.error('Failed to Process Asset and Extract Missing Links', asset, error);
    //    throw error;
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
    Key: `to-be-processed/${actionId}/${collectionId}/${objectId}.json`,
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
    // console.log('INDD Asset:', asset);

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
