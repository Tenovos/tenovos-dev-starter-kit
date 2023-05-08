// const aws = require('aws-sdk');
// const app = require('./src/app');
const Handler = require('./src/handlers/handler');
const ProxyHandler = require('./src/handlers/proxy');

const runHandler = async () => {
  try {
    // const lambda = new aws.Lambda({ region: "us-east-1" });
    // var params = {
    //   FunctionName: 'ENTER FUNCTION NAME',
    //   ReservedConcurrentExecutions: '0'
    // };
    // lambda.putFunctionConcurrency(params, function (err, data) {
    //   if (err) console.log(err, err.stack); // an error occurred
    //   else console.log(data);           // successful response
    // });
    await Handler.handler({
      Records: [
        {
          messageId: 'dc8a9981-c780-4a2d-b63c-bc34a5382806',
          receiptHandle:
            'AQEBLSsDZYdPLVdHKRD8b1NahhfeBeTbz9yRAOa8il/Wwpeyq+YvR8hxJyVUhZoogUkpFiGO9/y8THWGoeHLYAF+0DgxUJxnG2xm2+GhEKtxnkw9IDpd3kccTmyqRB6ccklT7HfVjJLfCTKp3CM2YMgfAnSMwYekZ3Rwqcqk7B9kFt8PSGhxaxMoHBMSN8TIRMH1MzAYSIeOX9ftsx5oDu3OHLkDmqi48uKWhX+ptwdRkdM1OtQWlwPN++iQHqcfxj06TSASpyNdW6BYYOQqoK5URgWkDU72NUVBv6gXF5QpGeJ70h0Ni4pj1CTep12AGo3QP0iHV+7kkRLrtqcbS2QSGOw4ZDX3AzYjFg18ZlpYEERBOpCy3H9FkM8pSSngA6cO1UwfhyxsyxCNmgNHrFmqnocDOHFMriLx2TZ/zALw5CI=',
          body: '{"id":"40404456-0494-4389-acbd-6a36eb626096","createdAt":1683326333810,"createdBy":"783f2498-366d-4bb4-83a8-8604d7e77163","customerId":"1654077511544","service":"asset","module":"asset","action":"action","data":{"objectId":"dd9aa519-47ff-4e10-8fb5-d0ecc8631b26","lastUpdatedEpoch":1683326333810,"match":["objectType"]}}',
          // body: '{"id":"2d386d49-9a12-4ccd-84c0-f41ee59ab184","createdAt":1679173333734,"createdBy":"9d81fedd-cd72-4f5a-bf15-39448cb3477b","customerId":"1654077511544","service":"asset","module":"asset","action":"action","data":{"objectId":"185706ef-1164-463f-b8d1-915f63a83636","lastUpdatedEpoch":1679434673176,"capturedChanges":{"lastUpdatedEpoch":1679434673176,"metadataDocument":{}},"change":["metadataDocument"]}}',
          attributes: {
            ApproximateReceiveCount: '1',
            AWSTraceHeader:
              'Root=1-641a4d86-4d3fdb91729a7ae713e592c3;Parent=2defe2467e2786b2;Sampled=0',
            SentTimestamp: '1679445384497',
            SenderId:
              'AROAURVER4ND6SEXZEQPP:ENTER TOPIC NAME',
            ApproximateFirstReceiveTimestamp: '1679445384503',
          },
          messageAttributes: {},
          md5OfBody: '4694d9ff9f21a88dcdff068de46910a6',
          eventSource: 'aws:sqs',
          eventSourceARN:
            'arn:aws:sqs:us-east-1:312803976007:1654077511544-avengers-test20',
          awsRegion: 'us-east-1',
        },
      ],
    });
  } catch (e) {
    console.error(e);
  } finally {
    console.log('Do any necessary cleanup here');
    console.log('Script complete.');
  }
};

const runProxyHandler = async () => {
  try {
    const event = {
      resource: '/proxy',
      path: '/proxy',
      httpMethod: 'POST',
      headers: {
        'Accept-Encoding': 'gzip,deflate',
        'CloudFront-Forwarded-Proto': 'https',
        'CloudFront-Is-Desktop-Viewer': 'true',
        'CloudFront-Is-Mobile-Viewer': 'false',
        'CloudFront-Is-SmartTV-Viewer': 'false',
        'CloudFront-Is-Tablet-Viewer': 'false',
        'CloudFront-Viewer-ASN': '16509',
        'CloudFront-Viewer-Country': 'US',
        'Content-Type': 'text/plain; charset=UTF-8',
        Host: 'xetm1juyvl.execute-api.us-east-1.amazonaws.com',
        'User-Agent': 'Amazon Simple Notification Service Agent',
        Via: '1.1 1019c7748e9bd9371b8cbc3777f0a40e.cloudfront.net (CloudFront)',
        'X-Amz-Cf-Id': '_EqzuDPIAvVblnWdgQM9algs55fwAFyfNPkK12j4nsMyIpcJm10QQA==',
        'x-amz-sns-message-id': '6ab41291-149a-5595-aea7-4e5e935dfdbd',
        'x-amz-sns-message-type': 'Notification',
        'x-amz-sns-subscription-arn': 'arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing:4c57814e-0784-4901-863f-ec6edbb95e96',
        'x-amz-sns-topic-arn': 'arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing',
        'X-Amzn-Trace-Id': 'Root=1-64558587-130afb201d6819f25fd55fa3',
        'X-Forwarded-For': '72.21.217.79, 70.132.59.133',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https',
      },
      multiValueHeaders: {
        'Accept-Encoding': [
          'gzip,deflate',
        ],
        'CloudFront-Forwarded-Proto': [
          'https',
        ],
        'CloudFront-Is-Desktop-Viewer': [
          'true',
        ],
        'CloudFront-Is-Mobile-Viewer': [
          'false',
        ],
        'CloudFront-Is-SmartTV-Viewer': [
          'false',
        ],
        'CloudFront-Is-Tablet-Viewer': [
          'false',
        ],
        'CloudFront-Viewer-ASN': [
          '16509',
        ],
        'CloudFront-Viewer-Country': [
          'US',
        ],
        'Content-Type': [
          'text/plain; charset=UTF-8',
        ],
        Host: [
          'xetm1juyvl.execute-api.us-east-1.amazonaws.com',
        ],
        'User-Agent': [
          'Amazon Simple Notification Service Agent',
        ],
        Via: [
          '1.1 1019c7748e9bd9371b8cbc3777f0a40e.cloudfront.net (CloudFront)',
        ],
        'X-Amz-Cf-Id': [
          '_EqzuDPIAvVblnWdgQM9algs55fwAFyfNPkK12j4nsMyIpcJm10QQA==',
        ],
        'x-amz-sns-message-id': [
          '6ab41291-149a-5595-aea7-4e5e935dfdbd',
        ],
        'x-amz-sns-message-type': [
          'Notification',
        ],
        'x-amz-sns-subscription-arn': [
          'arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing:4c57814e-0784-4901-863f-ec6edbb95e96',
        ],
        'x-amz-sns-topic-arn': [
          'arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing',
        ],
        'X-Amzn-Trace-Id': [
          'Root=1-64558587-130afb201d6819f25fd55fa3',
        ],
        'X-Forwarded-For': [
          '72.21.217.79, 70.132.59.133',
        ],
        'X-Forwarded-Port': [
          '443',
        ],
        'X-Forwarded-Proto': [
          'https',
        ],
      },
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      pathParameters: null,
      stageVariables: null,
      requestContext: {
        resourceId: 'yxdy3o',
        resourcePath: '/proxy',
        httpMethod: 'POST',
        extendedRequestId: 'EeHNOFEbIAMFY8w=',
        requestTime: '05/May/2023:22:39:03 +0000',
        path: '/Prod/proxy',
        accountId: '312803976007',
        protocol: 'HTTP/1.1',
        stage: 'Prod',
        domainPrefix: 'xetm1juyvl',
        requestTimeEpoch: 1683326343591,
        requestId: '758cd2e1-d80e-4314-9d88-24f8759ad20d',
        identity: {
          cognitoIdentityPoolId: null,
          accountId: null,
          cognitoIdentityId: null,
          caller: null,
          sourceIp: '72.21.217.79',
          principalOrgId: null,
          accessKey: null,
          cognitoAuthenticationType: null,
          cognitoAuthenticationProvider: null,
          userArn: null,
          userAgent: 'Amazon Simple Notification Service Agent',
          user: null,
        },
        domainName: 'xetm1juyvl.execute-api.us-east-1.amazonaws.com',
        apiId: 'xetm1juyvl',
      },
      body: '{\n'
        + '  "Type" : "Notification",\n'
        + '  "MessageId" : "6ab41291-149a-5595-aea7-4e5e935dfdbd",\n'
        + '  "TopicArn" : "arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing",\n'
        + '  "Message" : "{\\"id\\":\\"40404456-0494-4389-acbd-6a36eb626096\\",\\"createdAt\\":1683326333810,\\"createdBy\\":\\"783f2498-366d-4bb4-83a8-8604d7e77163\\",\\"customerId\\":\\"1654077511544\\",\\"service\\":\\"asset\\",\\"module\\":\\"asset\\",\\"action\\":\\"action\\",\\"data\\":{\\"objectId\\":\\"dd9aa519-47ff-4e10-8fb5-d0ecc8631b26\\",\\"lastUpdatedEpoch\\":1683326333810,\\"match\\":[\\"objectType\\"]}}",\n'
        + '  "Timestamp" : "2023-05-05T22:39:03.532Z",\n'
        + '  "SignatureVersion" : "1",\n'
        + '  "Signature" : "WLZI/vm8T/eD/ckYwdjbc4Zs+HFp08bZW3bZZ0wzkpA+xpnF3OWMwK7Ml0xusr+tJSErIgGl/UHqLSoHIhaexK8HkDUsOKRTEJwIDN35qG3LtDpFfpflPHQX/WLLcJCc/VVj+j7d7bW/p2XeYYydb5GgFNQyzBvfYFmanyAzwZPdEffw62YU7iQkYMsr3fVoT/75enbtl4JdMA1WGBicq0CUo5BIsxHHEp1FOtYWXAfajEwdbocropqLEhKouoV82/ync+juETtmbuD+5mmCYJ6X+5DgmRde6wD9OrO3QTOiQKLbJugy4qbGIfmjt5Pr92D+UFr6egZ/+hlJ56zcPg==",\n'
        + '  "SigningCertURL" : "https://sns.us-east-1.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem",\n'
        + '  "UnsubscribeURL" : "https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing:4c57814e-0784-4901-863f-ec6edbb95e96",\n'
        + '  "MessageAttributes" : {\n'
        + '    "service" : {"Type":"String","Value":"asset"},\n'
        + '    "module" : {"Type":"String","Value":"asset"},\n'
        + '    "customerId" : {"Type":"String","Value":"1654077511544"},\n'
        + '    "action" : {"Type":"String","Value":"action"}\n'
        + '  }\n'
        + '}',
      isBase64Encoded: false,
    };

    await ProxyHandler.handler(event);
  } catch (error) {
    console.error(error);
  } finally {
    console.log('Do Cleanup Here');
  }
};

// Run Handler
runHandler();
// runProxyHandler();
