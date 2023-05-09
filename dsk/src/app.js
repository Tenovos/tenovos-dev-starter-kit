const fetch = require('node-fetch');
const utilities = require('./tools/utilities');
const appAuth = require('./libs/auth.js');

exports.someBusinessLogic = async function someBusinessLogic(assetId) {
  console.log('I have been executed...sort of...');
  const accountIdSecrets = JSON.parse(process.env.SECRETS);
  await appAuth.tenovosAuth(fetch);

  const response = await utilities.getAsset(assetId, fetch);
  console.log(`Asset object: \nJSON.stringify(${response})`);
};
