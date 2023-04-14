/*
 * Copyright (C) Tenovos Corporation - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Ian Chesnut <ian@tenovos.com>, August 2023
 */

require("dotenv").config({ path: __dirname + "/../.env" });
const assert = require('assert');
const utilities = require("../src/tools/utilities");

const event = {
  "resource": "/enter-path-here",
  "path": "/enter-path-here",
  "httpMethod": "POST",
  "headers": {
    "Accept-Encoding": "gzip,deflate",
    "CloudFront-Forwarded-Proto": "https",
    "CloudFront-Is-Desktop-Viewer": "true",
    "CloudFront-Is-Mobile-Viewer": "false",
    "CloudFront-Is-SmartTV-Viewer": "false",
    "CloudFront-Is-Tablet-Viewer": "false",
    "CloudFront-Viewer-ASN": "16509",
    "CloudFront-Viewer-Country": "US",
    "Content-Type": "text/plain; charset=UTF-8",
    "Host": "4ud7zi9f01.execute-api.us-east-1.amazonaws.com",
    "User-Agent": "Amazon Simple Notification Service Agent",
    "Via": "1.1 fcb94596db202c75ac0e559b3183be72.cloudfront.net (CloudFront)",
    "X-Amz-Cf-Id": "75pyBkXO6miQud8CjfWx_7U41Zjnyh8NXRVVnSf8bktejrg66SkNNw==",
    "x-amz-sns-message-id": "d2e2f205-10f5-5700-acde-ae7cd3024d88",
    "x-amz-sns-message-type": "Notification",
    "x-amz-sns-subscription-arn": "arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing:bf3a4e5f-3519-4be5-8e81-12fb8cffe8af",
    "x-amz-sns-topic-arn": "arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing",
    "X-Amzn-Trace-Id": "Root=1-63ffc1b7-289b50c956c22ffe5095d7da",
    "X-Forwarded-For": "72.21.217.136, 15.158.50.37",
    "X-Forwarded-Port": "443",
    "X-Forwarded-Proto": "https"
  },
  "multiValueHeaders": {
    "Accept-Encoding": [
      "gzip,deflate"
    ],
    "CloudFront-Forwarded-Proto": [
      "https"
    ],
    "CloudFront-Is-Desktop-Viewer": [
      "true"
    ],
    "CloudFront-Is-Mobile-Viewer": [
      "false"
    ],
    "CloudFront-Is-SmartTV-Viewer": [
      "false"
    ],
    "CloudFront-Is-Tablet-Viewer": [
      "false"
    ],
    "CloudFront-Viewer-ASN": [
      "16509"
    ],
    "CloudFront-Viewer-Country": [
      "US"
    ],
    "Content-Type": [
      "text/plain; charset=UTF-8"
    ],
    "Host": [
      "4ud7zi9f01.execute-api.us-east-1.amazonaws.com"
    ],
    "User-Agent": [
      "Amazon Simple Notification Service Agent"
    ],
    "Via": [
      "1.1 fcb94596db202c75ac0e559b3183be72.cloudfront.net (CloudFront)"
    ],
    "X-Amz-Cf-Id": [
      "75pyBkXO6miQud8CjfWx_7U41Zjnyh8NXRVVnSf8bktejrg66SkNNw=="
    ],
    "x-amz-sns-message-id": [
      "d2e2f205-10f5-5700-acde-ae7cd3024d88"
    ],
    "x-amz-sns-message-type": [
      "Notification"
    ],
    "x-amz-sns-subscription-arn": [
      "arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing:bf3a4e5f-3519-4be5-8e81-12fb8cffe8af"
    ],
    "x-amz-sns-topic-arn": [
      "arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing"
    ],
    "X-Amzn-Trace-Id": [
      "Root=1-63ffc1b7-289b50c956c22ffe5095d7da"
    ],
    "X-Forwarded-For": [
      "72.21.217.136, 15.158.50.37"
    ],
    "X-Forwarded-Port": [
      "443"
    ],
    "X-Forwarded-Proto": [
      "https"
    ]
  },
  "queryStringParameters": null,
  "multiValueQueryStringParameters": null,
  "pathParameters": null,
  "stageVariables": null,
  "requestContext": {
    "resourceId": "jmsbwn",
    "resourcePath": "/enter-path-here",
    "httpMethod": "POST",
    "extendedRequestId": "BHs0yHcIoAMFYOw=",
    "requestTime": "01/Mar/2023:21:20:55 +0000",
    "path": "/Prod/enter-path-here",
    "accountId": "312803976007",
    "protocol": "HTTP/1.1",
    "stage": "Prod",
    "domainPrefix": "4ud7zi9f01",
    "requestTimeEpoch": 1677705655957,
    "requestId": "78e275e6-1363-4a16-a77e-64d50ef7dc48",
    "identity": {
      "cognitoIdentityPoolId": null,
      "accountId": null,
      "cognitoIdentityId": null,
      "caller": null,
      "sourceIp": "72.21.217.136",
      "principalOrgId": null,
      "accessKey": null,
      "cognitoAuthenticationType": null,
      "cognitoAuthenticationProvider": null,
      "userArn": null,
      "userAgent": "Amazon Simple Notification Service Agent",
      "user": null
    },
    "domainName": "4ud7zi9f01.execute-api.us-east-1.amazonaws.com",
    "apiId": "4ud7zi9f01"
  },
  "body": "{\n  \"Type\" : \"Notification\",\n  \"MessageId\" : \"d2e2f205-10f5-5700-acde-ae7cd3024d88\",\n  \"TopicArn\" : \"arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing\",\n  \"Message\" : \"{\\\"id\\\":\\\"d9b6a68e-1df6-420b-a992-04817f713245\\\",\\\"createdAt\\\":1677704082066,\\\"createdBy\\\":\\\"783f2498-366d-4bb4-83a8-8604d7e77163\\\",\\\"customerId\\\":\\\"1654077511544\\\",\\\"service\\\":\\\"asset\\\",\\\"module\\\":\\\"asset\\\",\\\"action\\\":\\\"update\\\",\\\"data\\\":{\\\"objectId\\\":\\\"fb0b0dc4-5ba6-4df2-8a2d-e36640aaa647\\\",\\\"lastUpdatedEpoch\\\":1677705653452,\\\"capturedChanges\\\":{\\\"lastUpdatedBy\\\":\\\"783f2498-366d-4bb4-83a8-8604d7e77163\\\",\\\"lastUpdatedEpoch\\\":1677705653452,\\\"metadataDocument\\\":{\\\"dsk_table_info\\\":[{\\\"dsk_attrcv_locale\\\":\\\"fr-fr\\\",\\\"dsk_attrtxt_callout_01\\\":\\\"French Oui\\\"}]}},\\\"change\\\":[\\\"metadataDocument\\\"]}}\",\n  \"Timestamp\" : \"2023-03-01T21:20:55.892Z\",\n  \"SignatureVersion\" : \"1\",\n  \"Signature\" : \"f/gXc04Bn85OBf/HQZ5/16YFQWaaIULBFpoGC4o9hboEPvhNeJoKGevxs9eVCCIWj+UR6RubK8S+tMGjQXmeQrUeBaXJSvuDocJn8kFYBJKurH9fbOfvPad49IgmRmxAXIgS6S+ahCey8Ba+ZsExPv69D6ugvckFdee6Kfj9z36qYgmSky/uwCC3Pc2Ki8I+TeQT9RzFkDJB0Ga/73WyAebZZ69dCOpUEz3PVwnUNv0KAAysb/2qqTnv59Kwt9wqHBy77d/EtaeXRWCPtM1F/YE2wNb9OutndphH/ccQMa3ZD5lPP9HQSFpQqEjb92LB73WlXyd758xfJvg8WVfZgQ==\",\n  \"SigningCertURL\" : \"https://sns.us-east-1.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem\",\n  \"UnsubscribeURL\" : \"https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing:bf3a4e5f-3519-4be5-8e81-12fb8cffe8af\",\n  \"MessageAttributes\" : {\n    \"service\" : {\"Type\":\"String\",\"Value\":\"asset\"},\n    \"module\" : {\"Type\":\"String\",\"Value\":\"asset\"},\n    \"customerId\" : {\"Type\":\"String\",\"Value\":\"1654077511544\"},\n    \"action\" : {\"Type\":\"String\",\"Value\":\"update\"}\n  }\n}",
  "isBase64Encoded": false
}

const nonAssetEditEvent = {
  "resource": "/enter-path-here",
  "path": "/enter-path-here",
  "httpMethod": "POST",
  "headers": {
    "Accept-Encoding": "gzip,deflate",
    "CloudFront-Forwarded-Proto": "https",
    "CloudFront-Is-Desktop-Viewer": "true",
    "CloudFront-Is-Mobile-Viewer": "false",
    "CloudFront-Is-SmartTV-Viewer": "false",
    "CloudFront-Is-Tablet-Viewer": "false",
    "CloudFront-Viewer-ASN": "16509",
    "CloudFront-Viewer-Country": "US",
    "Content-Type": "text/plain; charset=UTF-8",
    "Host": "4ud7zi9f01.execute-api.us-east-1.amazonaws.com",
    "User-Agent": "Amazon Simple Notification Service Agent",
    "Via": "1.1 fcb94596db202c75ac0e559b3183be72.cloudfront.net (CloudFront)",
    "X-Amz-Cf-Id": "75pyBkXO6miQud8CjfWx_7U41Zjnyh8NXRVVnSf8bktejrg66SkNNw==",
    "x-amz-sns-message-id": "d2e2f205-10f5-5700-acde-ae7cd3024d88",
    "x-amz-sns-message-type": "Notification",
    "x-amz-sns-subscription-arn": "arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing:bf3a4e5f-3519-4be5-8e81-12fb8cffe8af",
    "x-amz-sns-topic-arn": "arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing",
    "X-Amzn-Trace-Id": "Root=1-63ffc1b7-289b50c956c22ffe5095d7da",
    "X-Forwarded-For": "72.21.217.136, 15.158.50.37",
    "X-Forwarded-Port": "443",
    "X-Forwarded-Proto": "https"
  },
  "multiValueHeaders": {
    "Accept-Encoding": [
      "gzip,deflate"
    ],
    "CloudFront-Forwarded-Proto": [
      "https"
    ],
    "CloudFront-Is-Desktop-Viewer": [
      "true"
    ],
    "CloudFront-Is-Mobile-Viewer": [
      "false"
    ],
    "CloudFront-Is-SmartTV-Viewer": [
      "false"
    ],
    "CloudFront-Is-Tablet-Viewer": [
      "false"
    ],
    "CloudFront-Viewer-ASN": [
      "16509"
    ],
    "CloudFront-Viewer-Country": [
      "US"
    ],
    "Content-Type": [
      "text/plain; charset=UTF-8"
    ],
    "Host": [
      "4ud7zi9f01.execute-api.us-east-1.amazonaws.com"
    ],
    "User-Agent": [
      "Amazon Simple Notification Service Agent"
    ],
    "Via": [
      "1.1 fcb94596db202c75ac0e559b3183be72.cloudfront.net (CloudFront)"
    ],
    "X-Amz-Cf-Id": [
      "75pyBkXO6miQud8CjfWx_7U41Zjnyh8NXRVVnSf8bktejrg66SkNNw=="
    ],
    "x-amz-sns-message-id": [
      "d2e2f205-10f5-5700-acde-ae7cd3024d88"
    ],
    "x-amz-sns-message-type": [
      "Notification"
    ],
    "x-amz-sns-subscription-arn": [
      "arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing:bf3a4e5f-3519-4be5-8e81-12fb8cffe8af"
    ],
    "x-amz-sns-topic-arn": [
      "arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing"
    ],
    "X-Amzn-Trace-Id": [
      "Root=1-63ffc1b7-289b50c956c22ffe5095d7da"
    ],
    "X-Forwarded-For": [
      "72.21.217.136, 15.158.50.37"
    ],
    "X-Forwarded-Port": [
      "443"
    ],
    "X-Forwarded-Proto": [
      "https"
    ]
  },
  "queryStringParameters": null,
  "multiValueQueryStringParameters": null,
  "pathParameters": null,
  "stageVariables": null,
  "requestContext": {
    "resourceId": "jmsbwn",
    "resourcePath": "/enter-path-here",
    "httpMethod": "POST",
    "extendedRequestId": "BHs0yHcIoAMFYOw=",
    "requestTime": "01/Mar/2023:21:20:55 +0000",
    "path": "/Prod/enter-path-here",
    "accountId": "312803976007",
    "protocol": "HTTP/1.1",
    "stage": "Prod",
    "domainPrefix": "4ud7zi9f01",
    "requestTimeEpoch": 1677705655957,
    "requestId": "78e275e6-1363-4a16-a77e-64d50ef7dc48",
    "identity": {
      "cognitoIdentityPoolId": null,
      "accountId": null,
      "cognitoIdentityId": null,
      "caller": null,
      "sourceIp": "72.21.217.136",
      "principalOrgId": null,
      "accessKey": null,
      "cognitoAuthenticationType": null,
      "cognitoAuthenticationProvider": null,
      "userArn": null,
      "userAgent": "Amazon Simple Notification Service Agent",
      "user": null
    },
    "domainName": "4ud7zi9f01.execute-api.us-east-1.amazonaws.com",
    "apiId": "4ud7zi9f01"
  },
  "body": "{\n  \"Type\" : \"Notification\",\n  \"MessageId\" : \"d2e2f205-10f5-5700-acde-ae7cd3024d88\",\n  \"TopicArn\" : \"arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing\",\n  \"Message\" : \"{\\\"id\\\":\\\"d9b6a68e-1df6-420b-a992-04817f713245\\\",\\\"createdAt\\\":1677704082066,\\\"createdBy\\\":\\\"783f2498-366d-4bb4-83a8-8604d7e77163\\\",\\\"customerId\\\":\\\"1654077511544\\\",\\\"service\\\":\\\"asset\\\",\\\"module\\\":\\\"asset\\\",\\\"action\\\":\\\"create\\\",\\\"data\\\":{\\\"objectId\\\":\\\"fb0b0dc4-5ba6-4df2-8a2d-e36640aaa647\\\",\\\"lastUpdatedEpoch\\\":1677705653452,\\\"capturedChanges\\\":{\\\"lastUpdatedBy\\\":\\\"9d81fedd-cd72-4f5a-bf15-39448cb3477b\\\",\\\"lastUpdatedEpoch\\\":1677705653452,\\\"metadataDocument\\\":{\\\"dsk_table_info\\\":[{\\\"dsk_attrcv_locale\\\":\\\"fr-fr\\\",\\\"dsk_attrtxt_callout_01\\\":\\\"French Oui\\\"}]}},\\\"change\\\":[\\\"metadataDocument\\\"]}}\",\n  \"Timestamp\" : \"2023-03-01T21:20:55.892Z\",\n  \"SignatureVersion\" : \"1\",\n  \"Signature\" : \"f/gXc04Bn85OBf/HQZ5/16YFQWaaIULBFpoGC4o9hboEPvhNeJoKGevxs9eVCCIWj+UR6RubK8S+tMGjQXmeQrUeBaXJSvuDocJn8kFYBJKurH9fbOfvPad49IgmRmxAXIgS6S+ahCey8Ba+ZsExPv69D6ugvckFdee6Kfj9z36qYgmSky/uwCC3Pc2Ki8I+TeQT9RzFkDJB0Ga/73WyAebZZ69dCOpUEz3PVwnUNv0KAAysb/2qqTnv59Kwt9wqHBy77d/EtaeXRWCPtM1F/YE2wNb9OutndphH/ccQMa3ZD5lPP9HQSFpQqEjb92LB73WlXyd758xfJvg8WVfZgQ==\",\n  \"SigningCertURL\" : \"https://sns.us-east-1.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem\",\n  \"UnsubscribeURL\" : \"https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing:bf3a4e5f-3519-4be5-8e81-12fb8cffe8af\",\n  \"MessageAttributes\" : {\n    \"service\" : {\"Type\":\"String\",\"Value\":\"asset\"},\n    \"module\" : {\"Type\":\"String\",\"Value\":\"asset\"},\n    \"customerId\" : {\"Type\":\"String\",\"Value\":\"1654077511544\"},\n    \"action\" : {\"Type\":\"String\",\"Value\":\"create\"}\n  }\n}",
  "isBase64Encoded": false
}

const eventCreatedByApiUser = {
  "resource": "/enter-path-here",
  "path": "/enter-path-here",
  "httpMethod": "POST",
  "headers": {
    "Accept-Encoding": "gzip,deflate",
    "CloudFront-Forwarded-Proto": "https",
    "CloudFront-Is-Desktop-Viewer": "true",
    "CloudFront-Is-Mobile-Viewer": "false",
    "CloudFront-Is-SmartTV-Viewer": "false",
    "CloudFront-Is-Tablet-Viewer": "false",
    "CloudFront-Viewer-ASN": "16509",
    "CloudFront-Viewer-Country": "US",
    "Content-Type": "text/plain; charset=UTF-8",
    "Host": "4ud7zi9f01.execute-api.us-east-1.amazonaws.com",
    "User-Agent": "Amazon Simple Notification Service Agent",
    "Via": "1.1 fcb94596db202c75ac0e559b3183be72.cloudfront.net (CloudFront)",
    "X-Amz-Cf-Id": "75pyBkXO6miQud8CjfWx_7U41Zjnyh8NXRVVnSf8bktejrg66SkNNw==",
    "x-amz-sns-message-id": "d2e2f205-10f5-5700-acde-ae7cd3024d88",
    "x-amz-sns-message-type": "Notification",
    "x-amz-sns-subscription-arn": "arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing:bf3a4e5f-3519-4be5-8e81-12fb8cffe8af",
    "x-amz-sns-topic-arn": "arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing",
    "X-Amzn-Trace-Id": "Root=1-63ffc1b7-289b50c956c22ffe5095d7da",
    "X-Forwarded-For": "72.21.217.136, 15.158.50.37",
    "X-Forwarded-Port": "443",
    "X-Forwarded-Proto": "https"
  },
  "multiValueHeaders": {
    "Accept-Encoding": [
      "gzip,deflate"
    ],
    "CloudFront-Forwarded-Proto": [
      "https"
    ],
    "CloudFront-Is-Desktop-Viewer": [
      "true"
    ],
    "CloudFront-Is-Mobile-Viewer": [
      "false"
    ],
    "CloudFront-Is-SmartTV-Viewer": [
      "false"
    ],
    "CloudFront-Is-Tablet-Viewer": [
      "false"
    ],
    "CloudFront-Viewer-ASN": [
      "16509"
    ],
    "CloudFront-Viewer-Country": [
      "US"
    ],
    "Content-Type": [
      "text/plain; charset=UTF-8"
    ],
    "Host": [
      "4ud7zi9f01.execute-api.us-east-1.amazonaws.com"
    ],
    "User-Agent": [
      "Amazon Simple Notification Service Agent"
    ],
    "Via": [
      "1.1 fcb94596db202c75ac0e559b3183be72.cloudfront.net (CloudFront)"
    ],
    "X-Amz-Cf-Id": [
      "75pyBkXO6miQud8CjfWx_7U41Zjnyh8NXRVVnSf8bktejrg66SkNNw=="
    ],
    "x-amz-sns-message-id": [
      "d2e2f205-10f5-5700-acde-ae7cd3024d88"
    ],
    "x-amz-sns-message-type": [
      "Notification"
    ],
    "x-amz-sns-subscription-arn": [
      "arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing:bf3a4e5f-3519-4be5-8e81-12fb8cffe8af"
    ],
    "x-amz-sns-topic-arn": [
      "arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing"
    ],
    "X-Amzn-Trace-Id": [
      "Root=1-63ffc1b7-289b50c956c22ffe5095d7da"
    ],
    "X-Forwarded-For": [
      "72.21.217.136, 15.158.50.37"
    ],
    "X-Forwarded-Port": [
      "443"
    ],
    "X-Forwarded-Proto": [
      "https"
    ]
  },
  "queryStringParameters": null,
  "multiValueQueryStringParameters": null,
  "pathParameters": null,
  "stageVariables": null,
  "requestContext": {
    "resourceId": "jmsbwn",
    "resourcePath": "/enter-path-here",
    "httpMethod": "POST",
    "extendedRequestId": "BHs0yHcIoAMFYOw=",
    "requestTime": "01/Mar/2023:21:20:55 +0000",
    "path": "/Prod/enter-path-here",
    "accountId": "312803976007",
    "protocol": "HTTP/1.1",
    "stage": "Prod",
    "domainPrefix": "4ud7zi9f01",
    "requestTimeEpoch": 1677705655957,
    "requestId": "78e275e6-1363-4a16-a77e-64d50ef7dc48",
    "identity": {
      "cognitoIdentityPoolId": null,
      "accountId": null,
      "cognitoIdentityId": null,
      "caller": null,
      "sourceIp": "72.21.217.136",
      "principalOrgId": null,
      "accessKey": null,
      "cognitoAuthenticationType": null,
      "cognitoAuthenticationProvider": null,
      "userArn": null,
      "userAgent": "Amazon Simple Notification Service Agent",
      "user": null
    },
    "domainName": "4ud7zi9f01.execute-api.us-east-1.amazonaws.com",
    "apiId": "4ud7zi9f01"
  },
  "body": "{\n  \"Type\" : \"Notification\",\n  \"MessageId\" : \"d2e2f205-10f5-5700-acde-ae7cd3024d88\",\n  \"TopicArn\" : \"arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing\",\n  \"Message\" : \"{\\\"id\\\":\\\"d9b6a68e-1df6-420b-a992-04817f713245\\\",\\\"createdAt\\\":1677704082066,\\\"createdBy\\\":\\\"9d81fedd-cd72-4f5a-bf15-39448cb3477b\\\",\\\"customerId\\\":\\\"1654077511544\\\",\\\"service\\\":\\\"asset\\\",\\\"module\\\":\\\"asset\\\",\\\"action\\\":\\\"update\\\",\\\"data\\\":{\\\"objectId\\\":\\\"fb0b0dc4-5ba6-4df2-8a2d-e36640aaa647\\\",\\\"lastUpdatedEpoch\\\":1677705653452,\\\"capturedChanges\\\":{\\\"lastUpdatedBy\\\":\\\"9d81fedd-cd72-4f5a-bf15-39448cb3477b\\\",\\\"lastUpdatedEpoch\\\":1677705653452,\\\"metadataDocument\\\":{\\\"dsk_table_info\\\":[{\\\"dsk_attrcv_locale\\\":\\\"fr-fr\\\",\\\"dsk_attrtxt_callout_01\\\":\\\"French Oui\\\"}]}},\\\"change\\\":[\\\"metadataDocument\\\"]}}\",\n  \"Timestamp\" : \"2023-03-01T21:20:55.892Z\",\n  \"SignatureVersion\" : \"1\",\n  \"Signature\" : \"f/gXc04Bn85OBf/HQZ5/16YFQWaaIULBFpoGC4o9hboEPvhNeJoKGevxs9eVCCIWj+UR6RubK8S+tMGjQXmeQrUeBaXJSvuDocJn8kFYBJKurH9fbOfvPad49IgmRmxAXIgS6S+ahCey8Ba+ZsExPv69D6ugvckFdee6Kfj9z36qYgmSky/uwCC3Pc2Ki8I+TeQT9RzFkDJB0Ga/73WyAebZZ69dCOpUEz3PVwnUNv0KAAysb/2qqTnv59Kwt9wqHBy77d/EtaeXRWCPtM1F/YE2wNb9OutndphH/ccQMa3ZD5lPP9HQSFpQqEjb92LB73WlXyd758xfJvg8WVfZgQ==\",\n  \"SigningCertURL\" : \"https://sns.us-east-1.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem\",\n  \"UnsubscribeURL\" : \"https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:384854818783:1654077511544-asm-event-publishing:bf3a4e5f-3519-4be5-8e81-12fb8cffe8af\",\n  \"MessageAttributes\" : {\n    \"service\" : {\"Type\":\"String\",\"Value\":\"asset\"},\n    \"module\" : {\"Type\":\"String\",\"Value\":\"asset\"},\n    \"customerId\" : {\"Type\":\"String\",\"Value\":\"1654077511544\"},\n    \"action\" : {\"Type\":\"String\",\"Value\":\"update\"}\n  }\n}",
  "isBase64Encoded": false
}

describe('getApiEventType tests', () => {
  it('verifies true returned for asset edit event', async () => {
    const SegfaultHandler = require('segfault-handler');
    SegfaultHandler.registerHandler('crash.log');
    const response = utilities.getApiEventType(event);
    assert(response);
  });
  it('verifies false returned for non asset edit event', async () => {
    const response = utilities.getApiEventType(nonAssetEditEvent);
    assert(!response);
  });
  it('verifies false returned for asset edit event created by api user', async () => {
    const response = utilities.getApiEventType(eventCreatedByApiUser);
    assert(!response);
  });
});

describe('small utility tests', () => {
  it('verifies true is returned', async () => {
    const response = utilities.writeStatus('This is a test');
    assert(response);
  });
  it('verifies sleepFor returns a promise', async () => {
    const response = utilities.sleepFor(1000);
    assert(Object.prototype.toString.call(response) === "[object Promise]");
  });
  it('verifies removeSignature works when a single question mark is in string', async () => {
    const response = utilities.removeSignature('a?b');
    assert(response === "a");
  });
});

describe('test api calls', () => {
  it('verifies getMetadataById api call returns success object', async () => {
    const fetch = require('jest-fetch-mock');
    jest.setMock('node-fetch', fetch);
    fetch.mockResponse(JSON.stringify({ ok: true, message: 'YATTA!', json: async () => { return 'test' } }));
    const response = await utilities.getMetadataById('test', fetch);
    console.log(response);
    assert(response);
  });
  it('verifies getMetadataById api throws error if response fails', async () => {

    const fetch = require('jest-fetch-mock');
    jest.setMock('node-fetch', fetch);
    fetch.mockResponse(JSON.stringify({ ok: false, message: 'YATTA!', json: async () => { return 'test' } }));

    try {
      const response = await utilities.getMetadataById('test', fetch);
      fail();
    } catch (e) {
      //success
    }
  });

  it('verifies getPreSigned api call returns success object', async () => {

    const fetch = require('jest-fetch-mock');
    jest.setMock('node-fetch', fetch);
    fetch.mockResponse(JSON.stringify({ ok: true, message: 'YATTA!', json: async () => { return 'test' } }));
    const response = await utilities.getPreSigned('test', fetch);
    console.log(response);
    assert(response);
  });
  it('verifies getPreSigned api throws error if response fails', async () => {

    const fetch = require('jest-fetch-mock');
    jest.setMock('node-fetch', fetch);
    fetch.mockResponse(JSON.stringify({ ok: false, message: 'YATTA!', json: async () => { return 'test' } }));

    try {
      const response = await utilities.getPreSigned('test', fetch);
      fail();
    } catch (e) {
      //success
    }
  });

  it('verifies getMetadataIdsFromSearchField api throws error if response fails', async () => {

    const fetch = require('jest-fetch-mock');
    jest.setMock('node-fetch', fetch);
    fetch.mockResponse(JSON.stringify({ ok: false, message: 'YATTA!', templateId: 'x', templateName: "Asset Localization Template", json: async () => { return { templateId: 'x', templateName: "Asset Localization Template" } } }));

    try {
      const response = await utilities.getMetadataIdsFromSearchField([], fetch);
      fail();
    } catch (e) {
      //success
    }
  });

  it('verifies getMetadataTemplate api call returns success object', async () => {

    const fetch = require('jest-fetch-mock');
    jest.setMock('node-fetch', fetch);
    fetch.mockResponse(JSON.stringify({ ok: true, message: 'YATTA!', json: async () => { return 'test' } }));
    const response = await utilities.getMetadataTemplate('test', fetch);
    console.log(response);
    assert(response);
  });
  it('verifies getMetadataTemplate api throws error if response fails', async () => {

    const fetch = require('jest-fetch-mock');
    jest.setMock('node-fetch', fetch);
    fetch.mockResponse(JSON.stringify({ ok: false, message: 'YATTA!', json: async () => { return 'test' } }));

    try {
      const response = await utilities.getMetadataTemplate('test', fetch);
      fail();
    } catch (e) {
      //success
    }
  });

  it('verifies createLink api call returns success object', async () => {

    const fetch = require('jest-fetch-mock');
    jest.setMock('node-fetch', fetch);
    fetch.mockResponse(JSON.stringify({ ok: true, message: 'YATTA!', json: async () => { return 'test' } }));
    const response = await utilities.createLink('x', 'y', 'z', fetch);
    console.log(response);
    assert(response);
  });
  it('verifies createLink api throws error if response fails', async () => {

    const fetch = require('jest-fetch-mock');
    jest.setMock('node-fetch', fetch);
    fetch.mockResponse(JSON.stringify({ ok: false, message: 'YATTA!', json: async () => { return 'test' } }));

    try {
      const response = await utilities.createLink('x', 'y', 'z', fetch);
      fail();
    } catch (e) {
      //success
    }
  });

  it('verifies getControlledVocabularyValues api call returns success object', async () => {

    const fetch = require('jest-fetch-mock');
    jest.setMock('node-fetch', fetch);
    fetch.mockResponse(JSON.stringify({ ok: true, message: 'YATTA!', metadataDocument: { values: [] }, json: async () => { return { metadataDocument: { values: [] } } } }));
    const response = await utilities.getControlledVocabularyValues('test', fetch);
    console.log(response);
    assert(response);
  });
  it('verifies getControlledVocabularyValues api throws error if response fails', async () => {

    const fetch = require('jest-fetch-mock');
    jest.setMock('node-fetch', fetch);
    fetch.mockResponse({ ok: false, message: 'YATTA!', json: async () => { return { "metadataDocument": { "values": [] } } } });

    try {
      const response = await utilities.getControlledVocabularyValues('test', fetch);
      fail();
    } catch (e) {
      //success
    }
  });

  it('verifies createNewAsset api call returns success object', async () => {

    const fetch = require('jest-fetch-mock');
    jest.setMock('node-fetch', fetch);
    fetch.mockResponse(JSON.stringify({ ok: true, message: 'YATTA!', json: async () => { return 'test' } }));
    const response = await utilities.createNewAsset('test', fetch);
    console.log(response);
    assert(response);
  });
  it('verifies createNewAsset api throws error if response fails', async () => {

    const fetch = require('jest-fetch-mock');
    jest.setMock('node-fetch', fetch);
    fetch.mockResponse(JSON.stringify({ ok: false, message: 'YATTA!', json: async () => { return 'test' } }));

    try {
      const response = await utilities.createNewAsset('test', fetch);
      fail();
    } catch (e) {
      //success
    }
  });

  it('verifies updateTableMetadataByid api call returns success object', async () => {

    const fetch = require('jest-fetch-mock');
    jest.setMock('node-fetch', fetch);
    fetch.mockResponse(JSON.stringify({ ok: true, message: 'YATTA!', json: async () => { return 'test' } }));
    const response = await utilities.updateTableMetadataByid('x', 'y', fetch);
    console.log(response);
    assert(response);
  });
  it('verifies updateTableMetadataByid api throws error if response fails', async () => {

    const fetch = require('jest-fetch-mock');
    jest.setMock('node-fetch', fetch);
    fetch.mockResponse(JSON.stringify({ ok: false, message: 'YATTA!', json: async () => { return 'test' } }));

    try {
      const response = await utilities.updateTableMetadataByid('x', 'y', fetch);
      fail();
    } catch (e) {
      //success
    }
  });

});

