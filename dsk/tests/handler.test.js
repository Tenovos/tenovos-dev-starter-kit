/*
 * Copyright (C) Tenovos Corporation - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Ian Chesnut <ian@tenovos.com>, August 2023
 */

require("dotenv").config({ path: __dirname + "/../.env" });
const assert = require('assert');

//   "resource": "/enter-path-here",
//   "path": "/enter-path-here",
//   "httpMethod": "POST",
//   "headers": {
//     "Accept-Encoding": "gzip,deflate",
//     "CloudFront-Forwarded-Proto": "https",
//     "CloudFront-Is-Desktop-Viewer": "true",
//     "CloudFront-Is-Mobile-Viewer": "false",
//     "CloudFront-Is-SmartTV-Viewer": "false",
//     "CloudFront-Is-Tablet-Viewer": "false",
//     "CloudFront-Viewer-ASN": "16509",
//     "CloudFront-Viewer-Country": "US",
//     "Content-Type": "text/plain; charset=UTF-8",
//     "Host": "4ud7zi9f01.execute-api.us-east-1.amazonaws.com",
//     "User-Agent": "Amazon Simple Notification Service Agent",
//     "Via": "1.1 fcb94596db202c75ac0e559b3183be72.cloudfront.net (CloudFront)",
//     "X-Amz-Cf-Id": "75pyBkXO6miQud8CjfWx_7U41Zjnyh8NXRVVnSf8bktejrg66SkNNw==",
//     "x-amz-sns-message-id": "d2e2f205-10f5-5700-acde-ae7cd3024d88",
//     "x-amz-sns-message-type": "Notification",
//     "x-amz-sns-subscription-arn": "arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing:bf3a4e5f-3519-4be5-8e81-12fb8cffe8af",
//     "x-amz-sns-topic-arn": "arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing",
//     "X-Amzn-Trace-Id": "Root=1-63ffc1b7-289b50c956c22ffe5095d7da",
//     "X-Forwarded-For": "72.21.217.136, 15.158.50.37",
//     "X-Forwarded-Port": "443",
//     "X-Forwarded-Proto": "https"
//   },
//   "multiValueHeaders": {
//     "Accept-Encoding": [
//       "gzip,deflate"
//     ],
//     "CloudFront-Forwarded-Proto": [
//       "https"
//     ],
//     "CloudFront-Is-Desktop-Viewer": [
//       "true"
//     ],
//     "CloudFront-Is-Mobile-Viewer": [
//       "false"
//     ],
//     "CloudFront-Is-SmartTV-Viewer": [
//       "false"
//     ],
//     "CloudFront-Is-Tablet-Viewer": [
//       "false"
//     ],
//     "CloudFront-Viewer-ASN": [
//       "16509"
//     ],
//     "CloudFront-Viewer-Country": [
//       "US"
//     ],
//     "Content-Type": [
//       "text/plain; charset=UTF-8"
//     ],
//     "Host": [
//       "4ud7zi9f01.execute-api.us-east-1.amazonaws.com"
//     ],
//     "User-Agent": [
//       "Amazon Simple Notification Service Agent"
//     ],
//     "Via": [
//       "1.1 fcb94596db202c75ac0e559b3183be72.cloudfront.net (CloudFront)"
//     ],
//     "X-Amz-Cf-Id": [
//       "75pyBkXO6miQud8CjfWx_7U41Zjnyh8NXRVVnSf8bktejrg66SkNNw=="
//     ],
//     "x-amz-sns-message-id": [
//       "d2e2f205-10f5-5700-acde-ae7cd3024d88"
//     ],
//     "x-amz-sns-message-type": [
//       "Notification"
//     ],
//     "x-amz-sns-subscription-arn": [
//       "arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing:bf3a4e5f-3519-4be5-8e81-12fb8cffe8af"
//     ],
//     "x-amz-sns-topic-arn": [
//       "arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing"
//     ],
//     "X-Amzn-Trace-Id": [
//       "Root=1-63ffc1b7-289b50c956c22ffe5095d7da"
//     ],
//     "X-Forwarded-For": [
//       "72.21.217.136, 15.158.50.37"
//     ],
//     "X-Forwarded-Port": [
//       "443"
//     ],
//     "X-Forwarded-Proto": [
//       "https"
//     ]
//   },
//   "queryStringParameters": null,
//   "multiValueQueryStringParameters": null,
//   "pathParameters": null,
//   "stageVariables": null,
//   "requestContext": {
//     "resourceId": "jmsbwn",
//     "resourcePath": "/enter-path-here",
//     "httpMethod": "POST",
//     "extendedRequestId": "BHs0yHcIoAMFYOw=",
//     "requestTime": "01/Mar/2023:21:20:55 +0000",
//     "path": "/Prod/enter-path-here",
//     "accountId": "312803976007",
//     "protocol": "HTTP/1.1",
//     "stage": "Prod",
//     "domainPrefix": "4ud7zi9f01",
//     "requestTimeEpoch": 1677705655957,
//     "requestId": "78e275e6-1363-4a16-a77e-64d50ef7dc48",
//     "identity": {
//       "cognitoIdentityPoolId": null,
//       "accountId": null,
//       "cognitoIdentityId": null,
//       "caller": null,
//       "sourceIp": "72.21.217.136",
//       "principalOrgId": null,
//       "accessKey": null,
//       "cognitoAuthenticationType": null,
//       "cognitoAuthenticationProvider": null,
//       "userArn": null,
//       "userAgent": "Amazon Simple Notification Service Agent",
//       "user": null
//     },
//     "domainName": "4ud7zi9f01.execute-api.us-east-1.amazonaws.com",
//     "apiId": "4ud7zi9f01"
//   },
//   "body": "{\n  \"Type\" : \"Notification\",\n  \"MessageId\" : \"d2e2f205-10f5-5700-acde-ae7cd3024d88\",\n  \"TopicArn\" : \"arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing\",\n  \"Message\" : \"{\\\"id\\\":\\\"d9b6a68e-1df6-420b-a992-04817f713245\\\",\\\"createdAt\\\":1677704082066,\\\"createdBy\\\":\\\"783f2498-366d-4bb4-83a8-8604d7e77163\\\",\\\"customerId\\\":\\\"1654077511544\\\",\\\"service\\\":\\\"asset\\\",\\\"module\\\":\\\"asset\\\",\\\"action\\\":\\\"update\\\",\\\"data\\\":{\\\"objectId\\\":\\\"fb0b0dc4-5ba6-4df2-8a2d-e36640aaa647\\\",\\\"lastUpdatedEpoch\\\":1677705653452,\\\"capturedChanges\\\":{\\\"lastUpdatedBy\\\":\\\"some-allowed-uuid\\\",\\\"lastUpdatedEpoch\\\":1677705653452,\\\"metadataDocument\\\":{\\\"dsk_table_info\\\":[{\\\"dsk_attrcv_locale\\\":\\\"fr-fr\\\",\\\"dsk_attrtxt_callout_01\\\":\\\"French Oui\\\"}]}},\\\"change\\\":[\\\"metadataDocument\\\"]}}\",\n  \"Timestamp\" : \"2023-03-01T21:20:55.892Z\",\n  \"SignatureVersion\" : \"1\",\n  \"Signature\" : \"f/gXc04Bn85OBf/HQZ5/16YFQWaaIULBFpoGC4o9hboEPvhNeJoKGevxs9eVCCIWj+UR6RubK8S+tMGjQXmeQrUeBaXJSvuDocJn8kFYBJKurH9fbOfvPad49IgmRmxAXIgS6S+ahCey8Ba+ZsExPv69D6ugvckFdee6Kfj9z36qYgmSky/uwCC3Pc2Ki8I+TeQT9RzFkDJB0Ga/73WyAebZZ69dCOpUEz3PVwnUNv0KAAysb/2qqTnv59Kwt9wqHBy77d/EtaeXRWCPtM1F/YE2wNb9OutndphH/ccQMa3ZD5lPP9HQSFpQqEjb92LB73WlXyd758xfJvg8WVfZgQ==\",\n  \"SigningCertURL\" : \"https://sns.us-east-1.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem\",\n  \"UnsubscribeURL\" : \"https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing:bf3a4e5f-3519-4be5-8e81-12fb8cffe8af\",\n  \"MessageAttributes\" : {\n    \"service\" : {\"Type\":\"String\",\"Value\":\"asset\"},\n    \"module\" : {\"Type\":\"String\",\"Value\":\"asset\"},\n    \"customerId\" : {\"Type\":\"String\",\"Value\":\"1654077511544\"},\n    \"action\" : {\"Type\":\"String\",\"Value\":\"update\"}\n  }\n}",
//   "isBase64Encoded": false
// }

// api uuid for user 9d81fedd-cd72-4f5a-bf15-39448cb3477b
const event = {
  Records: [
    {
      messageId: "dc8a9981-c780-4a2d-b63c-bc34a5382806",
      receiptHandle:
        "AQEBLSsDZYdPLVdHKRD8b1NahhfeBeTbz9yRAOa8il/Wwpeyq+YvR8hxJyVUhZoogUkpFiGO9/y8THWGoeHLYAF+0DgxUJxnG2xm2+GhEKtxnkw9IDpd3kccTmyqRB6ccklT7HfVjJLfCTKp3CM2YMgfAnSMwYekZ3Rwqcqk7B9kFt8PSGhxaxMoHBMSN8TIRMH1MzAYSIeOX9ftsx5oDu3OHLkDmqi48uKWhX+ptwdRkdM1OtQWlwPN++iQHqcfxj06TSASpyNdW6BYYOQqoK5URgWkDU72NUVBv6gXF5QpGeJ70h0Ni4pj1CTep12AGo3QP0iHV+7kkRLrtqcbS2QSGOw4ZDX3AzYjFg18ZlpYEERBOpCy3H9FkM8pSSngA6cO1UwfhyxsyxCNmgNHrFmqnocDOHFMriLx2TZ/zALw5CI=",
      body: '{"id":"2d386d49-9a12-4ccd-84c0-f41ee59ab184","createdAt":1679173333734,"createdBy":"some-allowed-uuid","customerId":"CUSTOMER ID","service":"asset","module":"asset","action":"update","data":{"objectId":"185706ef-1164-463f-b8d1-915f63a83636","lastUpdatedEpoch":1679434673176,"capturedChanges":{"lastUpdatedEpoch":1679434673176,"metadataDocument":{}},"change":["metadataDocument"]}}',
      attributes: {
        ApproximateReceiveCount: "1",
        AWSTraceHeader:
          "Root=1-641a4d86-4d3fdb91729a7ae713e592c3;Parent=2defe2467e2786b2;Sampled=0",
        SentTimestamp: "1679445384497",
        SenderId:
          "AROAURVER4ND6SEXZEQPP:ENTER TOPIC NAME",
        ApproximateFirstReceiveTimestamp: "1679445384503",
      },
      messageAttributes: {},
      md5OfBody: "4694d9ff9f21a88dcdff068de46910a6",
      eventSource: "aws:sqs",
      eventSourceARN:
        "arn:aws:sqs:us-east-1:312803976007:1654077511544-avengers-test20",
      awsRegion: "us-east-1",
    },
  ],
};

const result = {
  statusCode: 200,
  body: JSON.stringify({ message: "lambda executed" }),
  headers: { "content-type": "application/json" },
};

process.env.MODE = "TEST";

describe('lambda handler tests', () => {
  it('verifies consistent success response', async () => {
    // jest.mock('../src/app', () => {
    //   return {
    //     main: () => jest.fn().mockReturnValue({ "some": "object" })
    //   }
    // });
    // jest.mock('../src/tools/utilities', () => {
    //   return {
    //     getApiEventType: (x) => jest.fn().mockReturnValue({ "some": "object" })
    //   }
    // });

    const handler = require('../src/handlers/handler');
    const response = await handler.handler(event, null);
    assert(response.statusCode === result.statusCode);
  });
  it('verifies 500 when invalid event is sent', async () => {
    const handler = require('../src/handlers/handler');
    const response = await handler.handler(null, null); // this should result in 500
    assert(response.statusCode === 500);
  });
});

