const app = require("./src/app");
const entry = require("./src/handlers/handler");
const aws = require("aws-sdk");

(async () => {
  try {
    const lambda = new aws.Lambda({ region: "us-east-1" });
    var params = {
      FunctionName: 'ENTER FUNCTION NAME',
      ReservedConcurrentExecutions: '0'
    };
    lambda.putFunctionConcurrency(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data);           // successful response
    });
    await entry.handler({
      Records: [
        {
          messageId: "dc8a9981-c780-4a2d-b63c-bc34a5382806",
          receiptHandle:
            "AQEBLSsDZYdPLVdHKRD8b1NahhfeBeTbz9yRAOa8il/Wwpeyq+YvR8hxJyVUhZoogUkpFiGO9/y8THWGoeHLYAF+0DgxUJxnG2xm2+GhEKtxnkw9IDpd3kccTmyqRB6ccklT7HfVjJLfCTKp3CM2YMgfAnSMwYekZ3Rwqcqk7B9kFt8PSGhxaxMoHBMSN8TIRMH1MzAYSIeOX9ftsx5oDu3OHLkDmqi48uKWhX+ptwdRkdM1OtQWlwPN++iQHqcfxj06TSASpyNdW6BYYOQqoK5URgWkDU72NUVBv6gXF5QpGeJ70h0Ni4pj1CTep12AGo3QP0iHV+7kkRLrtqcbS2QSGOw4ZDX3AzYjFg18ZlpYEERBOpCy3H9FkM8pSSngA6cO1UwfhyxsyxCNmgNHrFmqnocDOHFMriLx2TZ/zALw5CI=",
          body: '{"id":"2d386d49-9a12-4ccd-84c0-f41ee59ab184","createdAt":1679173333734,"createdBy":"9d81fedd-cd72-4f5a-bf15-39448cb3477b","customerId":"1656431277105","service":"asset","module":"asset","action":"update","data":{"objectId":"185706ef-1164-463f-b8d1-915f63a83636","lastUpdatedEpoch":1679434673176,"capturedChanges":{"lastUpdatedEpoch":1679434673176,"metadataDocument":{}},"change":["metadataDocument"]}}',
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
    });
  } catch (e) {
    console.error(e);
  } finally {
    console.log("Do any necessary cleanup here");
    console.log("Script complete.");
  }
})();
