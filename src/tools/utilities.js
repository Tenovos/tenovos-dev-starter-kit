const _ = require("underscore");
const request = require("request-promise");
const moment = require("moment");
const config = require("../../config/config.json");
const AWS = require("aws-sdk");
const theSecret = require("../libs/getAwsSecrets");
const fetch = require("node-fetch");
const tools = require("./utilities");
const documentManifestUrl = config.documentManifestUrl;
const documentTextUrl = config.documentTextUrl;

/* Initialize S3 object -- we must use signatureVersion: 'v4' for presigned PUT urls */
const region = config.s3_region || "us-east-1";
const bucket = config.s3_bucket;
const S3 = new AWS.S3({
  apiVersion: "2006-03-01",
  signatureVersion: "v4",
  region,
});

exports.getApiEventType = (apiEvent) => {
  console.log("entered getapieventtype");
  try {
    console.log(`api event is next`);
    console.log(JSON.stringify(apiEvent));
    // const messageObj = JSON.parse(apiEvent.body);
    // const messageObj = JSON.parse(bodyObj.Message);

    const { service, module, action } = apiEvent;
    //
    if (service === "asset" && module === "asset" && action === "update") {
      console.log(
        `checking if user [${JSON.parse(process.env.SECRETS).TN_USER_ID
        }] is permitted`
      );
      if (
        apiEvent.createdBy === JSON.parse(process.env.SECRETS).TN_USER_ID ||
        apiEvent.data.capturedChanges.lastUpdatedBy ===
        JSON.parse(process.env.SECRETS).TN_USER_ID ||
        apiEvent.data.capturedChanges.lastUpdatedBy === null ||
        apiEvent.data.capturedChanges.lastUpdatedBy === ""
      ) {
        console.log("ignoring message created by api user");
        return false;
      } else {
        console.log("Processing message created by: " + apiEvent.createdBy);
      }
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};

exports.sleepFor = function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

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

exports.assetValidated = async function validateAsset(asset) {
  return true;
};

exports.getMetadataById = async function getMetadataById(
  accountIdSecrets,
  assetId,
  nodeFetch
) {
  // GET the filename for a given asset Id
  console.log(`START getMetadataById (${assetId})`);
  var getMetadataByIdOptions = {
    method: "GET",
    url: accountIdSecrets.API_URL + "/asset/" + assetId,
    headers: {
      "X-API-Key": accountIdSecrets.API_KEY,
      AccessToken: process.env.TN_ACCESS_TOKEN,
      Authorization: process.env.TN_AUTHORIZATION,
      "Content-Type": "application/json",
    },
  };

  const response = await nodeFetch(
    getMetadataByIdOptions.url,
    getMetadataByIdOptions
  );
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status} statusText: ${response.statusText}`
    );
  }
  const data = await response.json();
  console.log(`SUCESS Getting Root Metadata for ${assetId}`);
  return data;
};

exports.searchByObjectId = async function searchByObjectId(
  accountIdSecrets,
  assetId,
  locale,
  nodeFetch
) {
  console.log(`START searchByObjectId (${assetId})`);
  const body = {
    from: 0,
    limit: 1,
    searchTerm: '["' + assetId + '"]',
    filters: "['(SomeAttribute:\"SomeValue\")']",
    operation: "AND",
  };

  // GET the filename for a given asset Id
  var searchByObjectIdOptions = {
    method: "POST",
    url: accountIdSecrets.API_URL + "/search/keyword",
    headers: {
      "X-API-Key": accountIdSecrets.API_KEY,
      AccessToken: process.env.TN_ACCESS_TOKEN,
      Authorization: process.env.TN_AUTHORIZATION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  const response = await nodeFetch(
    searchByObjectIdOptions.url,
    searchByObjectIdOptions
  );
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status} statusText: ${response.statusText}`
    );
  }
  const data = await response.json();
  console.log(`SUCCESS searchByObjectId (${assetId})`);
  return data;
};

exports.getMetadataTemplate = async function getMetadataTemplate(
  accountIdSecrets,
  templateId,
  nodeFetch
) {
  console.log(`Begin Get MetadataTemplate`);
  //get the Asset Localization table
  // GET the filename for a given asset Id
  var getMetadataTemplateOptions = {
    method: "GET",
    url: accountIdSecrets.API_URL + "/metadata/template/" + templateId,
    headers: {
      "X-API-Key": accountIdSecrets.API_KEY,
      AccessToken: process.env.TN_ACCESS_TOKEN,
      Authorization: process.env.TN_AUTHORIZATION,
      "Content-Type": "application/json",
    },
  };

  const response = await nodeFetch(
    getMetadataTemplateOptions.url,
    getMetadataTemplateOptions
  );
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status} statusText: ${response.statusText}`
    );
  }
  const data = await response.json();
  console.log(`SUCCESS: Get MetadataTemplate`);
  return data;
};

exports.getCurApiUserId = async function getCurApiUserId(
  accountIdSecrets,
  nodeFetch
) {
  // console.log(this);
  console.log(`SUCCESS: Get MetadataTemplate`);
  var getCurApiUserIdsOptions = {
    method: "GET",
    url: accountIdSecrets.API_URL + "/user",
    headers: {
      "X-API-Key": accountIdSecrets.API_KEY,
      AccessToken: process.env.TN_ACCESS_TOKEN,
      Authorization: process.env.TN_AUTHORIZATION,
      "Content-Type": "application/json",
    },
  };

  const response = await nodeFetch(
    getCurApiUserIdsOptions.url,
    getCurApiUserIdsOptions
  );
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status} statusText: ${response.statusText}`
    );
  }
  const data = await response.json();
  return data;
};

//***** getExistingLinks is currently unused
exports.getExistingLinks = async function getExistingLinks(
  accountIdSecrets,
  theAssetId,
  metadataTemplateId,
  nodeFetch
) {
  // This function will get the existing links of a given primary asset and only return the ones that have a created by of the API user ID and are a localized version of the primary asset
  console.log(`Begin Get getExistingLinks`);
  var getExistingLinksOptions = {
    method: "GET",
    url: accountIdSecrets.API_URL + "/asset/" + theAssetId + "/link/",
    headers: {
      "X-API-Key": accountIdSecrets.API_KEY,
      AccessToken: process.env.TN_ACCESS_TOKEN,
      Authorization: process.env.TN_AUTHORIZATION,
      "Content-Type": "application/json",
    },
  };

  const curApiUserInfo = await tools.getCurApiUserId(
    accountIdSecrets,
    nodeFetch
  );

  //this will be ALL links - even if they are in the recycle bin or NOT localized assets
  const response = await nodeFetch(
    getExistingLinksOptions.url,
    getExistingLinksOptions
  );
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status} statusText: ${response.statusText}`
    );
  }
  const allAssetLinks = await response.json();
  console.log("All links amount: " + allAssetLinks.length);
  // now we need to delete the links that aren't linkType = "child"

  const relatedAssetIds = [];
  _.forEach(allAssetLinks, function (key) {
    if (key.linkType === "child") {
      relatedAssetIds.push(key.secondaryId);
    }
  });
  console.log("related links amount: " + relatedAssetIds.length);

  // now modify the relatedAssetIds array with only the created by for the linked asset that is the same as the API user id
  const cleanedRelatedAssets = [];
  for (let i = 0; i < relatedAssetIds.length; i++) {
    const curId = relatedAssetIds[i];
    const fileMetadata = await tools.getMetadataById(
      accountIdSecrets,
      curId,
      nodeFetch
    );

    // only process files if the object id of row the doesn't exist, OR it exists but it's in the recycle bin

    // console.log(
    //   ": " +
    //     fileMetadata.currentVersion +
    //     fileMetadata.metadataTemplateId +
    //     fileMetadata.fileState
    // );
    //ok now lets get rid of any relationships that weren't originally created by the automation
    if (
      fileMetadata.currentVersion === "Y" &&
      fileMetadata.metadataTemplateId === metadataTemplateId &&
      fileMetadata.fileState === "available"
    ) {
      // localized version already exists - don't reprocess
      console.log(
        "don't reprocess: curversion?: " +
        fileMetadata.currentVersion +
        "\ntemplate id match?: " +
        fileMetadata.metadataTemplateId +
        " " +
        metadataTemplateId +
        "\nfilestate?: " +
        fileMetadata.fileState
      );
    } else {
      // localized version doesn't exist - reprocess
      console.log(
        "don't reprocess: curversion?: " +
        fileMetadata.currentVersion +
        "\ntemplate id match?: " +
        fileMetadata.metadataTemplateId +
        " " +
        metadataTemplateId +
        "\nfilestate?: " +
        fileMetadata.fileState
      );
      cleanedRelatedAssets.push(curId);
    }
  }
  console.log(`SUCCESS Get getExistingLinks`);
  return cleanedRelatedAssets;
};

exports.createLink = async function createLink(
  accountIdSecrets,
  rootAssetId,
  derivativeAssetId,
  linkType,
  nodeFetch
) {
  console.log(`Start createLink`);
  // create a relationship between the rootAssetId and the derivativeAssetId
  const body = {
    secondaryIds: [
      {
        id: derivativeAssetId,
        linkType: linkType,
      },
    ],
  };

  var createLinkOptions = {
    method: "POST",
    url: accountIdSecrets.API_URL + "/asset/" + rootAssetId + "/link/",
    headers: {
      "X-API-Key": accountIdSecrets.API_KEY,
      AccessToken: process.env.TN_ACCESS_TOKEN,
      Authorization: process.env.TN_AUTHORIZATION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  const response = await nodeFetch(createLinkOptions.url, createLinkOptions);
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status} statusText: ${response.statusText}`
    );
  }
  const data = await response.json();

  console.log(`SUCCESS Get createLink`);
  return data;
};

exports.getControlledVocabularyValues =
  async function getControlledVocabularyValues(
    accountIdSecrets,
    controlledVocabularyId,
    nodeFetch
  ) {
    // GET the controlled vocabulary values.id's for a given controlledVocabularyId
    var getControlledVocabularyValuesOptions = {
      method: "GET",
      url:
        accountIdSecrets.API_URL +
        "/metadata/vocabulary/" +
        controlledVocabularyId,
      headers: {
        "X-API-Key": accountIdSecrets.API_KEY,
        AccessToken: process.env.TN_ACCESS_TOKEN,
        Authorization: process.env.TN_AUTHORIZATION,
        "Content-Type": "application/json",
      },
    };

    const response = await nodeFetch(
      getControlledVocabularyValuesOptions.url,
      getControlledVocabularyValuesOptions
    );
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} statusText: ${response.statusText}`
      );
    }
    const data = await response.json();
    return data.metadataDocument.values;
  };

exports.createNewAsset = async function createNewAsset(
  accountIdSecrets,
  body,
  tableIndex,
  nodeFetch
) {
  console.log(`Start createNewAsset`);
  const objIdFieldId = await tools.getMetadataIdsFromSearchField(
    accountIdSecrets,
    ["dsk_attrtxt_localized_object_id"],
    nodeFetch
  );

  const localizedObjectIdColumn = _.findWhere(
    body.metadata[tableIndex].metadataDefinitionTableValue[0],
    {
      metadataDefinitionId: objIdFieldId.fieldsNamesIdsArr[0].id,
    }
  );
  const localizedObjectIdFoundIndex = _.findLastIndex(
    body.metadata[tableIndex].metadataDefinitionTableValue[0],
    {
      metadataDefinitionId: localizedObjectIdColumn.metadataDefinitionId,
    }
  );

  body.metadata[tableIndex].metadataDefinitionTableValue[0][
    localizedObjectIdFoundIndex
  ].metadataDefinitionValue = "";

  body.metadata.push({
    metadataDefinitionId: "some-uuid",
    metadataDefinitionValue: {
      valueId: "some-uuid",
    },
  });

  // create a new asset
  var createNewAssetOptions = {
    method: "POST",
    url: accountIdSecrets.API_URL + "/asset",
    headers: {
      "X-API-Key": accountIdSecrets.API_KEY,
      AccessToken: process.env.TN_ACCESS_TOKEN,
      Authorization: process.env.TN_AUTHORIZATION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  const response = await nodeFetch(
    createNewAssetOptions.url,
    createNewAssetOptions
  );
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status} statusText: ${response.statusText}`
    );
  }
  const data = await response.json();
  return data;
};

exports.updateTableMetadataByid = async function updateTableMetadataByid(
  accountIdSecrets,
  existingAssetid,
  theTable,
  nodeFetch
) {
  console.log(`START updateTableMetadataByid`);
  var updateTableMetadataByidOptions = {
    method: "PATCH",
    url: accountIdSecrets.API_URL + "/asset/" + existingAssetid,
    headers: {
      "X-API-Key": accountIdSecrets.API_KEY,
      AccessToken: process.env.TN_ACCESS_TOKEN,
      Authorization: process.env.TN_AUTHORIZATION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(theTable),
  };

  const response = await nodeFetch(
    updateTableMetadataByidOptions.url,
    updateTableMetadataByidOptions
  );
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status} statusText: ${response.statusText}`
    );
  }
  const data = await response.json();
  console.log(`SUCCESS updateTableMetadataByid`);
  return data;
};
