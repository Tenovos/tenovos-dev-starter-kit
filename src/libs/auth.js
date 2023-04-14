const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

const client = new SecretsManagerClient({
  region: "us-east-1",
});

const config = require("../../config/config.json");
const tools = require("../tools/utilities");
const appAuth = require("./auth");
const publishIngAccount = process.env.PUBLISHING_ACCOUNT;
const secret_name = process.env.CUSTOMER_ID + "_" + publishIngAccount + "_dsk";
console.log("🚀 ~ file: auth.js:15 ~ secret_name:", secret_name);

exports.setEnv = async function setEnv() {
  tools.writeStatus(
    `Start. Get Secrets from AWS secrets manager: ${secret_name}`
  );
  const accountIdSecrets = await appAuth.getAwsSecrets(secret_name);

  process.env.SECRETS = JSON.stringify(accountIdSecrets); //must be stringified to store in env
};

//GET secrets
exports.getAwsSecrets = async function () {
  let response;

  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }

  const secret = JSON.parse(response.SecretString);
  secret.PSD_PRIVATE_KEY = secret.PSD_PRIVATE_KEY.replaceAll("|||", "\n");
  return secret;
};

exports.parseSecretsByaccountId = async function parseSecretsByaccountId(
  theSecrets,
  accountId
) {
  // now loop through theSecrets and make a new array of just the ones we need for the accont id
  const tenantSecrets = {};
  Object.entries(theSecrets).forEach((entry) => {
    const [key, value] = entry;
    if (key.startsWith(accountId)) {
      theKey = key.replace(accountId, "");
      tenantSecrets[theKey] = value;
    } else if (key.startsWith("PSD_")) {
      //Now add the Photoshop API secrets
      tenantSecrets[key] = value;
    }
  });

  return tenantSecrets;
};

/* PSD API config for @adobe/jwt-auth */
exports.buildJWTConfig = async function buildJWTConfig(accountIdSecrets) {
  tools.writeStatus("buildJWTConfig PS API");
  // get last element of claim to use as metaScope
  const claim = accountIdSecrets.PSD_CLAIM;
  const metaScope = claim.split("/").pop();
  return {
    clientId: accountIdSecrets.PSD_CLIENT_ID,
    clientSecret: accountIdSecrets.PSD_CLIENT_SECRET,
    technicalAccountId: accountIdSecrets.PSD_SUBJECT,
    orgId: accountIdSecrets.PSD_ISSUER,
    metaScopes: [metaScope],
    privateKey: accountIdSecrets.PSD_PRIVATE_KEY,
  };
};

// GET the Tenevos Token
exports.tenevosAuth = async function tenevosAuth(accountIdSecrets, fetch) {
  tools.writeStatus("1. AUTH Tenovos");
  var options = {
    method: "POST",
    url: accountIdSecrets.API_URL + "/auth/token",
    headers: {
      "X-API-Key": accountIdSecrets.API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userPoolId: accountIdSecrets.API_URL,
      clientId: accountIdSecrets.CLIENT_ID,
      username: accountIdSecrets.USERNAME,
      password: accountIdSecrets.PASSWORD,
    }),
  };

  const response = await fetch(options.url, options);
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status} statusText: ${response.statusText}`
    );
  }

  const data = await response.json();

  process.env.TN_ACCESS_TOKEN = data.session.accessToken;
  process.env.TN_AUTHORIZATION = data.session.authorization;

  tools.writeStatus("AUTH Tenovos SUCCESS");
  return data;
};
