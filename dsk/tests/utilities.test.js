/*
 * Copyright (C) Tenovos Corporation - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Ian Chesnut <ian@tenovos.com>, August 2023
 */

require("dotenv").config({ path: __dirname + "/../.env" });
const assert = require('assert');
const utilities = require("../src/tools/utilities");

process.env.MODE = "TEST";

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

// api uuid for user 9d81fedd-cd72-4f5a-bf15-39448cb3477b
const nonAssetEditEvent = {
  Records: [
    {
      messageId: "dc8a9981-c780-4a2d-b63c-bc34a5382806",
      receiptHandle:
        "AQEBLSsDZYdPLVdHKRD8b1NahhfeBeTbz9yRAOa8il/Wwpeyq+YvR8hxJyVUhZoogUkpFiGO9/y8THWGoeHLYAF+0DgxUJxnG2xm2+GhEKtxnkw9IDpd3kccTmyqRB6ccklT7HfVjJLfCTKp3CM2YMgfAnSMwYekZ3Rwqcqk7B9kFt8PSGhxaxMoHBMSN8TIRMH1MzAYSIeOX9ftsx5oDu3OHLkDmqi48uKWhX+ptwdRkdM1OtQWlwPN++iQHqcfxj06TSASpyNdW6BYYOQqoK5URgWkDU72NUVBv6gXF5QpGeJ70h0Ni4pj1CTep12AGo3QP0iHV+7kkRLrtqcbS2QSGOw4ZDX3AzYjFg18ZlpYEERBOpCy3H9FkM8pSSngA6cO1UwfhyxsyxCNmgNHrFmqnocDOHFMriLx2TZ/zALw5CI=",
      body: '{"id":"2d386d49-9a12-4ccd-84c0-f41ee59ab184","createdAt":1679173333734,"createdBy":"some-allowed-uuid","customerId":"CUSTOMER ID","service":"asset","module":"asset","action":"create","data":{"objectId":"185706ef-1164-463f-b8d1-915f63a83636","lastUpdatedEpoch":1679434673176,"capturedChanges":{"lastUpdatedEpoch":1679434673176,"metadataDocument":{}},"change":["metadataDocument"]}}',
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


const eventCreatedByApiUser = {
  Records: [
    {
      messageId: "dc8a9981-c780-4a2d-b63c-bc34a5382806",
      receiptHandle:
        "AQEBLSsDZYdPLVdHKRD8b1NahhfeBeTbz9yRAOa8il/Wwpeyq+YvR8hxJyVUhZoogUkpFiGO9/y8THWGoeHLYAF+0DgxUJxnG2xm2+GhEKtxnkw9IDpd3kccTmyqRB6ccklT7HfVjJLfCTKp3CM2YMgfAnSMwYekZ3Rwqcqk7B9kFt8PSGhxaxMoHBMSN8TIRMH1MzAYSIeOX9ftsx5oDu3OHLkDmqi48uKWhX+ptwdRkdM1OtQWlwPN++iQHqcfxj06TSASpyNdW6BYYOQqoK5URgWkDU72NUVBv6gXF5QpGeJ70h0Ni4pj1CTep12AGo3QP0iHV+7kkRLrtqcbS2QSGOw4ZDX3AzYjFg18ZlpYEERBOpCy3H9FkM8pSSngA6cO1UwfhyxsyxCNmgNHrFmqnocDOHFMriLx2TZ/zALw5CI=",
      body: '{"id":"2d386d49-9a12-4ccd-84c0-f41ee59ab184","createdAt":1679173333734,"createdBy":"9d81fedd-cd72-4f5a-bf15-39448cb3477b","customerId":"CUSTOMER ID","service":"asset","module":"asset","action":"update","data":{"objectId":"185706ef-1164-463f-b8d1-915f63a83636","lastUpdatedEpoch":1679434673176,"capturedChanges":{"lastUpdatedEpoch":1679434673176,"metadataDocument":{}},"change":["metadataDocument"]}}',
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

describe('getApiEventType tests', () => {
  it('verifies true returned for asset edit event', async () => {
    const SegfaultHandler = require('segfault-handler');
    SegfaultHandler.registerHandler('crash.log');
    for (let index = 0; index < event.Records.length; index++) {
      const bodyString = event.Records[index].body;
      const body = JSON.parse(bodyString);
      const response = utilities.getApiEventType(body);
      assert(response);
    }
  });
  it('verifies false returned for non asset edit event', async () => {
    for (let index = 0; index < nonAssetEditEvent.Records.length; index++) {
      const bodyString = nonAssetEditEvent.Records[index].body;
      const body = JSON.parse(bodyString);
      const response = utilities.getApiEventType(body);
      assert(!response);
    }
  });
  it('verifies false returned for asset edit event created by api user', async () => {
    for (let index = 0; index < eventCreatedByApiUser.Records.length; index++) {
      const bodyString = eventCreatedByApiUser.Records[index].body;
      const body = JSON.parse(bodyString);
      const response = utilities.getApiEventType(body);
      assert(!response);
    }
  });
});

describe('small utility tests', () => {
  it('verifies sleepFor returns a promise', async () => {
    const response = utilities.sleepFor(1000);
    assert(Object.prototype.toString.call(response) === "[object Promise]");
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

