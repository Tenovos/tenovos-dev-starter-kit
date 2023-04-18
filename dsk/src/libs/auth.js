const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

const client = new SecretsManagerClient({
  region: "us-east-1",
});

const appAuth = require("./auth");
const publishIngAccount = process.env.PUBLISHING_ACCOUNT;
const secret_name = process.env.CUSTOMER_ID + "_" + publishIngAccount + "_dsk";

exports.setEnv = async function setEnv() {
  if (process.env.MODE === "CLOUD") {
    console.log(`In cloud mode, setting environment with secret named ${secret_name}`);
    const accountIdSecrets = await appAuth.getAwsSecrets(secret_name);
    process.env.SECRETS = JSON.stringify(accountIdSecrets); //must be stringified to store in env
  }
  else {
    console.log(`In local mode, setting environment via dotenv ${JSON.stringify(process.env)}`);
  }
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
    throw error;
  }

  const secret = JSON.parse(response.SecretString);
  return secret;
};

// GET the Tenevos Token
exports.tenevosAuth = async function tenevosAuth(fetch) {
  const accountIdSecrets = process.env.SECRETS;
  console.log("1. AUTH Tenovos");
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

  console.log(`data: ${JSON.stringify(data)}`);
  process.env.TN_ACCESS_TOKEN = data.session.accessToken;
  process.env.TN_AUTHORIZATION = data.session.authorization;

  console.log("AUTH Tenovos SUCCESS");
  return data;
};
