
exports.someBusinessLogic = async function someBusinessLogic(customerId, assetId) {
    const customApp = require(customerId);
    customApp.someBusinessLogic(assetId);
}