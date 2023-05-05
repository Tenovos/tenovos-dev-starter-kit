
const utilities = require('../../src/tools/utilities');
const fetch = require("node-fetch");
const appAuth = require("../../src/libs/auth");

exports.someBusinessLogic = async function someBusinessLogic(assetId) {
    console.log("I have been executed...sort of...");
    const accountIdSecrets = JSON.parse(process.env.SECRETS);
    await appAuth.tenevosAuth(fetch);

    const response = await utilities.getAsset(assetId, fetch);
    console.log(`Asset object: \nJSON.stringify(${response})`);
}