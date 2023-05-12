/* eslint-disable no-console */
// const AWS = require('aws-sdk');
// const App = require('./src/app');
// const entry = require('./src/handlers/handler');
const listEvents = require('./src/handlers/list-events');
const ProcessHandler = require('./src/handlers/handler');
const ProxyHandler = require('./src/handlers/proxy');
const MonitorHandler = require('./src/handlers/monitor');
const CustomHandler = require('./custom/src/customer/1654077511544/handler');
const Utilities = require('./src/tools/utilities');

const args = process.argv.slice(2);
const action = args[0];

async function debugAlt() {
  // const lambda = new aws.Lambda({ region: "us-east-1" });
  // var params = {
  //   FunctionName: 'ENTER FUNCTION NAME',
  //   ReservedConcurrentExecutions: '0'
  // };
  // lambda.putFunctionConcurrency(params, function (err, data) {
  //   if (err) console.log(err, err.stack); // an error occurred
  //   else console.log(data);           // successful response
  // });
  await ProcessHandler.handler({
    Records: [
      {
        messageId: 'dc8a9981-c780-4a2d-b63c-bc34a5382806',
        receiptHandle:
          'AQEBLSsDZYdPLVdHKRD8b1NahhfeBeTbz9yRAOa8il/Wwpeyq+YvR8hxJyVUhZoogUkpFiGO9/y8THWGoeHLYAF+0DgxUJxnG2xm2+GhEKtxnkw9IDpd3kccTmyqRB6ccklT7HfVjJLfCTKp3CM2YMgfAnSMwYekZ3Rwqcqk7B9kFt8PSGhxaxMoHBMSN8TIRMH1MzAYSIeOX9ftsx5oDu3OHLkDmqi48uKWhX+ptwdRkdM1OtQWlwPN++iQHqcfxj06TSASpyNdW6BYYOQqoK5URgWkDU72NUVBv6gXF5QpGeJ70h0Ni4pj1CTep12AGo3QP0iHV+7kkRLrtqcbS2QSGOw4ZDX3AzYjFg18ZlpYEERBOpCy3H9FkM8pSSngA6cO1UwfhyxsyxCNmgNHrFmqnocDOHFMriLx2TZ/zALw5CI=',
        body: '{"id":"2d386d49-9a12-4ccd-84c0-f41ee59ab184","createdAt":1679173333734,"createdBy":"9d81fedd-cd72-4f5a-bf15-39448cb3477b","customerId":"1654077511544","service":"asset","module":"asset","action":"update","data":{"objectId":"185706ef-1164-463f-b8d1-915f63a83636","lastUpdatedEpoch":1679434673176,"capturedChanges":{"lastUpdatedEpoch":1679434673176,"metadataDocument":{}},"change":["metadataDocument"]}}',
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
}

async function debugDskEvents() {
  console.log('debugging dsk events');
  await listEvents.handler({});
}

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
    const events = [
      {
        Records: [
          {
            messageId: '0d89ffa5-96e6-4d7f-9fb2-1b734fb50a72',
            receiptHandle: 'AQEBuzivb5yt0kjZWT7nnTZS8CjHo+NqyoViIs6kXKg1Ppw+p4aNeZTB7JdE6TuQBB0ktGW22RCEDL70sTRhtVBa6NaMWAwVHTEc14/I8ql+IdVQLTLzC7Omyron0QdQmw/ugg+fWdUxxK/CZR25jw9sUW+TsGa6KwsiPBcNQyqX9X3kQgdgzoIK941Z6EnktK+kDHPddjiswJxZZ0TPFZP0Y6/ze7ReIsPRSWypg5OD1dm7l5llKUq6f8C7+J0F3CcK3UuMQM5P5+VyAq5/3ujLoNFrXMGtsiZpDHw0GQ3WqqnIP4oTZCQyfzkBj8aeVZpYE3Gs43xxXsD7Fm8MGNql05o2eyo4sLxoeP098v7cgHFv1bHSr9QNS9NWW2gDTL6qWU3eVU4jB4U9iT2/DOYPuw==',
            body: '{"customerId":"1654077511544","actionId":"1a8240ab-8e87-4ece-9db1-dbdfd123eaeb","collectionId":"5a5ba890-5dd0-4e16-bf2f-c802ad1e2a46","objectId":"07228eee-8af7-49f0-8984-c516e68ace1e","filename":"102N_14_TSG_EN.indd","stage":"process-asset"}',
            attributes: {
              ApproximateReceiveCount: '1',
              AWSTraceHeader: 'Root=1-645ac7bf-12aa53c6585ae20a6fc4c4db;Parent=393b64467336cdef;Sampled=0;Lineage=4cf5a63c:0',
              SentTimestamp: '1683671008750',
              SenderId: 'AROAURVER4ND3DEEPMGDI:dsk-proxy-function-1654077511544-pp-ils',
              ApproximateFirstReceiveTimestamp: '1683671008761',
            },
            messageAttributes: {},
            md5OfBody: '5516cc412a3f6664d9bb285a04171864',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:312803976007:1654077511544-pp-ils',
            awsRegion: 'us-east-1',
          },
        ],
      },
      {
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
      },
    ];
    await ProcessHandler.handler(events[0]);
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

async function debugS3Put() {
  console.log('debugging S3');
  await CustomHandler.writeObjectToS3('dsk-1654077511544ppils-us-east-1', {
    actionId: 'some-action',
    collectionId: 'some-collection',
    objectId: 'some-object',
  });
}

async function debugS3Get() {
  Utilities.s3ListObjectsByName({
    bucket: 'dsk-1654077511544ppils-us-east-1',
  }).then(async (objects) => {
    console.log(`${objects.length} objects total`);
    for (let i = 0; i < objects.length; i += 1) {
      const object = objects[i];
      if (object.Key.endsWith('manifest.json')) {
        console.log(JSON.stringify(object));
        // eslint-disable-next-line no-await-in-loop
        const obj = await Utilities.s3GetKey('dsk-1654077511544ppils-us-east-1', object.Key);
        console.log(`abc ${obj.Body}`);
      }
    }
  });
}

async function debugMonitor() {
  console.log('debugging monitor');
  await MonitorHandler.handler({
    Records: [
      {
        messageId: '5de6631c-6daf-4b89-87bb-378bcfbdbebb',
        receiptHandle: 'AQEBDwZm0glwsaQ2g76zM0329LcXuoL71Fyo7A1wQDvFLx45MgLjamQaSnLMaG7cunETdd5J6p9OVaHmCMWAiLn/+A3TCvDKNaSOD0lpamnM1SYo8DX/POuhDWTwH7Qtj8N9M0Qb2s9y4qdXMlsvagvGAm3hSvTQKZ4F+GjOLt6cVBEvYzyLB7H6AKcO5bop4kVrMjK2utGdzS5frnlEaMhlBU/ixkGkaEAUT2yHBYMinXwhOR1RusEGQyBNK9g8tidlEv6maVtawNFOc2k7iFPVyQ7+J899r3cr7UtVCMU8qX3yJ6GvBWmmoG4rgp93P9RJ+2+vFPdr2zSTYCUWBGg9uJgZmRHrlOtZ0hYmaTZ8wXMsLSbp282wiWpNQQ8CzT3u7sdVb/FZnybvEX6dasNlsw==',
        body: '{"Records":[{"eventVersion":"2.1","eventSource":"aws:s3","awsRegion":"us-east-1","eventTime":"2023-05-12T02:39:10.347Z","eventName":"ObjectCreated:Put","userIdentity":{"principalId":"AWS:AROAURVER4ND3DEEPMGDI:dsk-proxyasync-function-1654077511544-pp-ils"},"requestParameters":{"sourceIPAddress":"3.236.70.59"},"responseElements":{"x-amz-request-id":"67SXCJ9PVMAJM9JV","x-amz-id-2":"6c6FNyY66ILORGh1gn64w4IKuIdPbMq+tOLx7vV7QtqW9DuijC9x7LY0KNPpbeEX633hebvM5zNG38WKyuS65zIa9VS22VeH"},"s3":{"s3SchemaVersion":"1.0","configurationId":"44ccc762-4133-4d7c-a68e-916eb16c1913","bucket":{"name":"dsk-1654077511544ppils-us-east-1","ownerIdentity":{"principalId":"ANQBBRPE6GR94"},"arn":"arn:aws:s3:::dsk-1654077511544ppils-us-east-1"},"object":{"key":"to-be-processed/8099d8df-4b7b-49e7-b79d-0c8234e60f63/5a5ba890-5dd0-4e16-bf2f-c802ad1e2a46/manifest.json","size":353,"eTag":"7160b18541c17848b4214e793dc573f1","sequencer":"00645DA6CE4872E0D2"}}}]}',
        attributes: {
          ApproximateReceiveCount: '1',
          AWSTraceHeader: 'Root=1-645da6ba-aa10b66ad0330592b2be0885;Parent=5b29ad892fb4d306;Sampled=0',
          SentTimestamp: '1683859151197',
          SenderId: 'AIDAJHIPRHEMV73VRJEBU',
          ApproximateFirstReceiveTimestamp: '1683859151211',
        },
        messageAttributes: {},
        md5OfBody: '784c767bbb77e82bdeaf79193ebdb418',
        eventSource: 'aws:sqs',
        eventSourceARN: 'arn:aws:sqs:us-east-1:312803976007:custom1654077511544-pp-ils',
        awsRegion: 'us-east-1',
      },
    ],
  }, {
    succeed() { console.log('succeeded via context'); },
  });
}

(async () => {
  try {
    switch (action) {
      case 'alt':
        await debugAlt();
        break;
      case 'dskEvents':
        await debugDskEvents();
        break;
      case 'handler':
        await runHandler();
        break;
      case 'proxyHandler':
        await runProxyHandler();
        break;
      case 's3Put':
        await debugS3Put();
        break;
      case 's3Get':
        debugS3Get();
        break;
      case 'monitor':
        await debugMonitor();
        break;
      default:
        console.log(`Invalid action[${action}]`);
        break;
    }
  } catch (e) {
    console.error(e);
  } finally {
    console.log('Done...');
  }
})();
