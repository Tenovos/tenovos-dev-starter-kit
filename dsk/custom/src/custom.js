
exports.someBusinessLogic = async function someBusinessLogic(customerId, assetId) {
    try {
        const customApp = require(`../../custom/src/${customerId}`);
        customApp.someBusinessLogic(assetId);
    } catch (error) {
        console.log('default business logic invoked');
    }
}