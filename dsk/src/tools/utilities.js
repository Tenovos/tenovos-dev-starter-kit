const _ = require('lodash');
const AWS = require('aws-sdk');
const fetchLocal = require('node-fetch');

const getStage = (apiEvent) => {
  let stage = null;
  try {
    const { action } = apiEvent;
    if (action && action === 'action') {
      stage = 'initial';
    } else if (apiEvent.stage === 'process-asset') {
      stage = 'process-asset';
    } else {
      stage = 'unknown';
    }
  } catch (e) {
    console.log('Error in getStage');
    return 'unknown';
  }
  return stage;
};

const getCollection = async function getCollection(id, nodeFetch) {
  const accountIdSecrets = JSON.parse(process.env.SECRETS);
  console.log('START Get Collection:', id);
  const options = {
    method: 'GET',
    url: `${accountIdSecrets.API_URL}/collection/${id}`,
    headers: {
      'X-API-Key': accountIdSecrets.API_KEY,
      AccessToken: process.env.TN_ACCESS_TOKEN,
      Authorization: process.env.TN_AUTHORIZATION,
      'Content-Type': 'application/json',
    },
  };

  const response = await nodeFetch(
    options.url,
    options,
  );
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status} statusText: ${response.statusText} `,
    );
  }
  const data = await response.json();
  console.log('END Get Collection:', JSON.stringify(data));
  return data;
};

const getApiEventType = (apiEvent) => {
  console.log('entered getapieventtype');
  try {
    console.log(`api event is next ${JSON.stringify(apiEvent)}`);
    console.log(JSON.stringify(apiEvent));

    const { service, module, action } = apiEvent;
    //
    if (service === 'asset' && module === 'asset' && action === 'action') {
      const secrets = JSON.parse(process.env.SECRETS);
      console.log(`checking if user[${secrets.TN_USER_ID}] is permitted`);
      const lastUpdatedBy = _.get(apiEvent, 'data.capturedChanges.lastUpdatedBy');
      if (
        apiEvent.createdBy === secrets.TN_USER_ID
        || lastUpdatedBy === secrets.TN_USER_ID
        || lastUpdatedBy === null
        || lastUpdatedBy === ''
      ) {
        console.log('ignoring message created by api user');
        return false;
      }
      console.log(`Processing message created by: ${apiEvent.createdBy}`);

      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to get Collection:', {
      collectionId: id,
    }, error);
    return false;
  }
};

const sleep = async (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

/**
 * Responsibilities
 * 1. confirm asset type and asset subtype are product and product photography respectively
 * 2. is there at least one localization row with data it in
 * 3. of those at least one row should have a status of not yes
 *
 * @param {*} accountIdSecrets
 * @param {*} assetObj
 * @param {*} nodeFetch
 */

const assetValidated = async (asset) => true;

const getAsset = async (assetId, nodeFetch) => {
  const accountIdSecrets = JSON.parse(process.env.SECRETS);
  // GET the filename for a given asset Id
  console.log(`START getAsset(${assetId})`);
  const getAssetOptions = {
    method: 'GET',
    url: `${accountIdSecrets.API_URL}/asset/${assetId}`,
    headers: {
      'X-API-Key': accountIdSecrets.API_KEY,
      AccessToken: process.env.TN_ACCESS_TOKEN,
      Authorization: process.env.TN_AUTHORIZATION,
      'Content-Type': 'application/json',
    },
  };
  console.log(`options: ${JSON.stringify(getAssetOptions)}`);
  const response = await nodeFetch(
    getAssetOptions.url,
    getAssetOptions,
  );
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status} statusText: ${response.statusText} `,
    );
  }
  const data = await response.json();
  console.log(`SUCCESS Get Asset ${assetId}`);
  return data;
};

const runKeywordSearch = async (searchTerm, options, nodeFetch) => {
  const accountIdSecrets = JSON.parse(process.env.SECRETS);

  console.log(`START runKeywordSearch(${searchTerm})`);
  const body = {
    from: 0,
    limit: 50,
    searchTerm,
    sortBy: [
      {
        metadataDefinitionId: 'createdEpoch',
        order: 'desc',
      },
    ],
    // filters: "['(SomeAttribute:\"SomeValue\")']",
    operation: 'AND',
    excludes: [
      'metadataDocument.text_content',
    ],
  };
  // Override Default Parameters with Options
  Object.assign(body, options);

  // GET the filename for a given asset Id
  const request = {
    method: 'POST',
    url: `${accountIdSecrets.API_URL}/search/keyword`,
    headers: {
      'X-API-Key': accountIdSecrets.API_KEY,
      AccessToken: process.env.TN_ACCESS_TOKEN,
      Authorization: process.env.TN_AUTHORIZATION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
  console.log(`Calling nodeFetch with request url [${request.url}] and request [${JSON.stringify(request)}]`);
  const response = await nodeFetch(request.url, request);
  if (!response.ok && response.status !== 404) {
    throw new Error(
      `HTTP error! status: ${response.status} statusText: ${response.statusText} `,
    );
  }
  const data = await response.json();
  console.log(`SUCCESS runKeywordSearch(${searchTerm})`);
  return data;
};

const getMetadataTemplate = async (templateId, nodeFetch) => {
  const accountIdSecrets = process.env.SECRETS;

  console.log('Begin Get MetadataTemplate');
  // get the Asset Localization table
  // GET the filename for a given asset Id
  const getMetadataTemplateOptions = {
    method: 'GET',
    url: `${accountIdSecrets.API_URL}/metadata/template/${templateId}`,
    headers: {
      'X-API-Key': accountIdSecrets.API_KEY,
      AccessToken: process.env.TN_ACCESS_TOKEN,
      Authorization: process.env.TN_AUTHORIZATION,
      'Content-Type': 'application/json',
    },
  };

  const response = await nodeFetch(
    getMetadataTemplateOptions.url,
    getMetadataTemplateOptions,
  );
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status} statusText: ${response.statusText} `,
    );
  }
  const data = await response.json();
  console.log('SUCCESS: Get MetadataTemplate');
  return data;
};

const getCurApiUserId = async (nodeFetch) => {
  const accountIdSecrets = process.env.SECRETS;

  // console.log(this);
  console.log('SUCCESS: Get MetadataTemplate');
  const getCurApiUserIdsOptions = {
    method: 'GET',
    url: `${accountIdSecrets.API_URL}/user`,
    headers: {
      'X-API-Key': accountIdSecrets.API_KEY,
      AccessToken: process.env.TN_ACCESS_TOKEN,
      Authorization: process.env.TN_AUTHORIZATION,
      'Content-Type': 'application/json',
    },
  };

  const response = await nodeFetch(
    getCurApiUserIdsOptions.url,
    getCurApiUserIdsOptions,
  );
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status} statusText: ${response.statusText} `,
    );
  }
  const data = await response.json();
  return data;
};

const extractAssetsFromAction = async (actionId) => {
  const action = await getAsset(actionId, fetchLocal);
  console.log(`Action: ${JSON.stringify(action)}`);

  return action;
};

//* **** getExistingLinks is currently unused
const getExistingLinks = async (theAssetId, metadataTemplateId, nodeFetch) => {
  const accountIdSecrets = process.env.SECRETS;

  // This function will get the existing links of a given primary asset and only return the ones
  // that have a created by of the API user ID and are a localized version of the primary asset
  console.log('Begin Get getExistingLinks');
  const getExistingLinksOptions = {
    method: 'GET',
    url: `${accountIdSecrets.API_URL}/asset/${theAssetId}/link/`,
    headers: {
      'X-API-Key': accountIdSecrets.API_KEY,
      AccessToken: process.env.TN_ACCESS_TOKEN,
      Authorization: process.env.TN_AUTHORIZATION,
      'Content-Type': 'application/json',
    },
  };

  // const curApiUserInfo = await getCurApiUserId(nodeFetch);

  // this will be ALL links - even if they are in the recycle bin or NOT localized assets
  const response = await nodeFetch(
    getExistingLinksOptions.url,
    getExistingLinksOptions,
  );
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status} statusText: ${response.statusText} `,
    );
  }
  const allAssetLinks = await response.json();
  console.log(`All links amount: ${allAssetLinks.length}`);
  // now we need to delete the links that aren't linkType = "child"

  const relatedAssetIds = [];
  _.forEach(allAssetLinks, (key) => {
    if (key.linkType === 'child') {
      relatedAssetIds.push(key.secondaryId);
    }
  });
  console.log(`related links amount: ${relatedAssetIds.length}`);

  // now modify the relatedAssetIds array with only the created by for the linked asset that is
  // the same as the API user id
  const cleanedRelatedAssets = [];
  for (let i = 0; i < relatedAssetIds.length; i += 1) {
    const curId = relatedAssetIds[i];
    // eslint-disable-next-line no-await-in-loop
    const fileMetadata = await getAsset(curId, nodeFetch);

    // only process files if the object id of row the doesn't exist, OR it exists but it's in the recycle bin

    // console.log(
    //   ": " +
    //     fileMetadata.currentVersion +
    //     fileMetadata.metadataTemplateId +
    //     fileMetadata.fileState
    // );
    // ok now lets get rid of any relationships that weren't originally created by the automation
    if (
      fileMetadata.currentVersion === 'Y'
      && fileMetadata.metadataTemplateId === metadataTemplateId
      && fileMetadata.fileState === 'available'
    ) {
      // localized version already exists - don't reprocess
      console.log(
        `don't reprocess: curversion?: ${fileMetadata.currentVersion
        }\ntemplate id match?: ${fileMetadata.metadataTemplateId
        } ${metadataTemplateId
        }\nfilestate?: ${fileMetadata.fileState}`,
      );
    } else {
      // localized version doesn't exist - reprocess
      console.log(
        `don't reprocess: curversion?: ${fileMetadata.currentVersion
        }\ntemplate id match?: ${fileMetadata.metadataTemplateId
        } ${metadataTemplateId
        }\nfilestate?: ${fileMetadata.fileState}`,
      );
      cleanedRelatedAssets.push(curId);
    }
  }
  console.log('SUCCESS Get getExistingLinks');
  return cleanedRelatedAssets;
};

const createLink = async (rootAssetId, derivativeAssetId, linkType, nodeFetch) => {
  const accountIdSecrets = process.env.SECRETS;

  console.log('Start createLink');
  // create a relationship between the rootAssetId and the derivativeAssetId
  const body = {
    secondaryIds: [
      {
        id: derivativeAssetId,
        linkType,
      },
    ],
  };

  const createLinkOptions = {
    method: 'POST',
    url: `${accountIdSecrets.API_URL}/asset/${rootAssetId}/link/`,
    headers: {
      'X-API-Key': accountIdSecrets.API_KEY,
      AccessToken: process.env.TN_ACCESS_TOKEN,
      Authorization: process.env.TN_AUTHORIZATION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  const response = await nodeFetch(createLinkOptions.url, createLinkOptions);
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status} statusText: ${response.statusText} `,
    );
  }
  const data = await response.json();

  console.log('SUCCESS Get createLink');
  return data;
};

const getControlledVocabularyValues = async (controlledVocabularyId, nodeFetch) => {
  const accountIdSecrets = process.env.SECRETS;

  // GET the controlled vocabulary values.id's for a given controlledVocabularyId
  const getControlledVocabularyValuesOptions = {
    method: 'GET',
    url:
      `${accountIdSecrets.API_URL
      }/metadata/vocabulary/${controlledVocabularyId}`,
    headers: {
      'X-API-Key': accountIdSecrets.API_KEY,
      AccessToken: process.env.TN_ACCESS_TOKEN,
      Authorization: process.env.TN_AUTHORIZATION,
      'Content-Type': 'application/json',
    },
  };

  const response = await nodeFetch(
    getControlledVocabularyValuesOptions.url,
    getControlledVocabularyValuesOptions,
  );
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status} statusText: ${response.statusText} `,
    );
  }
  const data = await response.json();
  return data.metadataDocument.values;
};

const updateTableMetadataByid = async (existingAssetid, theTable, nodeFetch) => {
  const accountIdSecrets = process.env.SECRETS;

  console.log('START updateTableMetadataByid');
  const updateTableMetadataByidOptions = {
    method: 'PATCH',
    url: `${accountIdSecrets.API_URL}/asset/${existingAssetid}`,
    headers: {
      'X-API-Key': accountIdSecrets.API_KEY,
      AccessToken: process.env.TN_ACCESS_TOKEN,
      Authorization: process.env.TN_AUTHORIZATION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(theTable),
  };

  const response = await nodeFetch(
    updateTableMetadataByidOptions.url,
    updateTableMetadataByidOptions,
  );
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status} statusText: ${response.statusText} `,
    );
  }
  const data = await response.json();
  console.log('SUCCESS updateTableMetadataByid');
  return data;
};

const s3PutObject = async (bucket, key, body, options) => new Promise((resolve, reject) => {
  console.log(`AWS_PROFILE: ${process.env.AWS_PROFILE}`);
  const s3 = new AWS.S3({
    region: 'us-east-1',
  });
  const params = {
    Bucket: bucket,
    Key: key,
    Body: JSON.stringify(body),
    ContentType: 'application/json',
  };
  if (options && Object.keys(options).length) {
    Object.assign(params, options);
  }
  console.log('Writing to s3', params);
  s3.putObject(
    params,
    (error, data) => {
      if (error) {
        const message = 'Failed to Put Object in S3';
        console.error(message, {
          bucket,
          key,
        }, JSON.stringify(error));
        reject(new Error(message));
      } else {
        console.log('Put Object in S3:', {
          bucket,
          key,
        }, JSON.stringify(data));
        resolve(data);
      }
    },
  );
});

const s3ListObjectsByName = ({ bucket, marker, prev }) => {
  console.log(`Getting all objects from bucket ${bucket}`);
  const s3 = new AWS.S3({
    region: 'us-east-1',
  });
  const params = {
    Bucket: bucket,
    Marker: marker,
  };

  return s3.listObjects(params).promise().then((data) => {
    let objects = data.Contents;
    console.log(`Found ${objects.length} objects...`);
    if (prev) {
      objects = prev.concat(objects);
    }
    if (data.IsTruncated) {
      const { length } = data.Contents;
      const mkr = data.Contents[length - 1].Key;
      return s3ListObjectsByName({
        bucket,
        mkr,
        prev: objects,
      });
    }
    return objects;
  });
};

const s3GetKey = async (bucket, key) => {
  console.log(`Getting key ${key} from bucket ${bucket}`);
  const s3 = new AWS.S3({
    region: 'us-east-1',
  });
  const file = await s3.getObject({
    Bucket: bucket,
    Key: key,
  }).promise();
  return file;
};

module.exports = {
  sleep,
  extractAssetsFromAction,
  getCollection,
  getStage,
  assetValidated,
  createLink,
  getApiEventType,
  getAsset,
  getControlledVocabularyValues,
  getCurApiUserId,
  getExistingLinks,
  getMetadataTemplate,
  updateTableMetadataByid,
  runKeywordSearch,
  s3PutObject,
  s3ListObjectsByName,
  s3GetKey,
};
