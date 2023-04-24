
const utilities = require('tools/utilities');

exports.someBusinessLogic = async function someBusinessLogic(assetId) {
  console.log("I have been executed...sort of...");
  const response = utilities.getAsset(assetId);
  console.log(`Asset object: \nJSON.stringify(${response})`);
}