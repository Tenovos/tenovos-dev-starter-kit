const _ = require("underscore");
const moment = require("moment");
const AWS = require("aws-sdk");
const tools = require("./utilities");

exports.getApiEventType = (apiEvent) => {
  console.log("entered getapieventtype");
  try {
    console.log(`api event is next`);
    console.log(JSON.stringify(apiEvent));

    const { service, module, action } = apiEvent;
    //
    if (service === "asset" && module === "asset" && action === "update") {
      console.log(`checking if user[${JSON.parse(process.env.SECRETS).TN_USER_ID}] is permitted`);
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

exports.getAsset = async function getAsset(
  assetId,
  nodeFetch
) {
  const accountIdSecrets = process.env.SECRETS;
  // GET the filename for a given asset Id
  console.log(`START getAsset(${assetId})`);
  var getAssetOptions = {
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
    getAssetOptions.url,
    getAssetOptions
  );
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status} statusText: ${response.statusText} `
    );
  }
  const data = await response.json();
  console.log(`SUCCESS Getting Root Metadata for ${assetId}`);
  return data;
};

exports.searchByObjectId = async function searchByObjectId(
  assetId,
  locale,
  nodeFetch
) {
  const accountIdSecrets = process.env.SECRETS;

  console.log(`START searchByObjectId(${assetId})`);
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
      `HTTP error! status: ${response.status} statusText: ${response.statusText} `
    );
  }
  const data = await response.json();
  console.log(`SUCCESS searchByObjectId(${assetId})`);
  return data;
};

exports.getMetadataTemplate = async function getMetadataTemplate(
  templateId,
  nodeFetch
) {
  const accountIdSecrets = process.env.SECRETS;

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
      `HTTP error! status: ${response.status} statusText: ${response.statusText} `
    );
  }
  const data = await response.json();
  console.log(`SUCCESS: Get MetadataTemplate`);
  return data;
};

exports.getCurApiUserId = async function getCurApiUserId(
  nodeFetch
) {
  const accountIdSecrets = process.env.SECRETS;

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
      `HTTP error! status: ${response.status} statusText: ${response.statusText} `
    );
  }
  const data = await response.json();
  return data;
};

//***** getExistingLinks is currently unused
exports.getExistingLinks = async function getExistingLinks(
  theAssetId,
  metadataTemplateId,
  nodeFetch
) {
  const accountIdSecrets = process.env.SECRETS;

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
    nodeFetch
  );

  //this will be ALL links - even if they are in the recycle bin or NOT localized assets
  const response = await nodeFetch(
    getExistingLinksOptions.url,
    getExistingLinksOptions
  );
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status} statusText: ${response.statusText} `
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
    const fileMetadata = await tools.getAsset(
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
  rootAssetId,
  derivativeAssetId,
  linkType,
  nodeFetch
) {
  const accountIdSecrets = process.env.SECRETS;

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
      `HTTP error! status: ${response.status} statusText: ${response.statusText} `
    );
  }
  const data = await response.json();

  console.log(`SUCCESS Get createLink`);
  return data;
};

exports.getControlledVocabularyValues =
  async function getControlledVocabularyValues(
    controlledVocabularyId,
    nodeFetch
  ) {
    const accountIdSecrets = process.env.SECRETS;

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
        `HTTP error! status: ${response.status} statusText: ${response.statusText} `
      );
    }
    const data = await response.json();
    return data.metadataDocument.values;
  };

exports.updateTableMetadataByid = async function updateTableMetadataByid(
  existingAssetid,
  theTable,
  nodeFetch
) {
  const accountIdSecrets = process.env.SECRETS;

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
      `HTTP error! status: ${response.status} statusText: ${response.statusText} `
    );
  }
  const data = await response.json();
  console.log(`SUCCESS updateTableMetadataByid`);
  return data;
};
