const AWS = require('aws-sdk');
const Utilities = require('../tools/utilities');

const handler = async (event, context) => {
  console.info(`ENTER_SERVICE: \n${JSON.stringify(event)}`);

  const lambda = new AWS.Lambda({
    region: 'us-east-1',
  });

  console.log(`Before async invocation caling ${process.env.ASYNC_LAMBDA}...`);
  lambda.invokeAsync({
    FunctionName: process.env.ASYNC_LAMBDA,
    InvokeArgs: JSON.stringify(event, null, 2),
  }, (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
  console.log('After async invocation...sleeping');
  await Utilities.sleep(10000);
  console.log('Woke up...');
  return context.succeed();
};

module.exports = {
  handler,
};
