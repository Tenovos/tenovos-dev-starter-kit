const enqueue = async (event) => {
  let customerId = '';

  try {
    const body = JSON.parse(event.body);
    customerId = body.MessageAttributes.customerId.Value;

    if (!customerId) {
      throw new Error('customerId not found');
    }
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const customApp = require(`./customer/${customerId}/enqueue`);
    await customApp.enqueue(event);
  } catch (error) {
    console.error('Custom Enqueue Error', {
      customerId,
      event,
    }, error);
  }
};

const someBusinessLogic = async (customerId, asset, stage) => {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const CustomApp = require(`./customer/${customerId}/handler`);
    await CustomApp.someBusinessLogic(asset, stage);
  } catch (error) {
    console.error('Custom Business Logic Error', {
      customerId,
      asset,
    }, error);
  }
};

module.exports = {
  enqueue,
  someBusinessLogic,
};
