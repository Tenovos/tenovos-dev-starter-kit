
exports.someBusinessLogic = async function someBusinessLogic(customerId, assetId) {
    const customApp = require(`../../custom/src/${customerId}`);
    customApp.someBusinessLogic(assetId);
}