const { readFileSync } = require("fs");
const {
    InvokeCommand,
    LambdaClient,
} = require("@aws-sdk/client-lambda");

const args = process.argv.slice(2);
const apiGatewayUrl = args[0];
const action = args[1];
const customerId = args[2];
const configLocation = args[3]; // s3 prefix where configs files are stored
const userId = args[4]; // admin user id

const featureName = "feature-dsk";
const region = "us-east-1";

const dskEvent = {
    name: `${featureName}`,
    events: [{ action: "update", module: "asset", service: "asset" }],
    publishTo: `${apiGatewayUrl}`,
};

async function perform() {
    console.log(action);
    if (action === "setup") {
        await setup();
    } else if (action === "teardown") {
        await teardown();
    } else if (action === "create-metadata") {
        const client = new LambdaClient({ region });
        const lambdaPayload = {
            body: {
                requestType: "create",
                configLocation,
                destCustomerId: customerId,
            },
            requestContext: {
                authorizer: {
                    userId,
                },
            },
        };
        console.log("Lambda Payload", lambdaPayload);
        const command = new InvokeCommand({
            FunctionName: "action-metadata-template-service",
            Payload: JSON.stringify(lambdaPayload),
        });
        const { Payload } = await client.send(command);
        const result = Buffer.from(Payload).toString();
        console.log("Lambda Result", result);
    } else {
        console.log("No action to perform...");
    }
}

async function setup() {
    let data = readFileSync("./profile-doc.json");

    const integObj = JSON.parse(JSON.parse(data)).integrators || null;
    const extIntegObj = integObj.external || null;

    let newProf = JSON.parse(JSON.parse(data));
    newProf = JSON.parse(JSON.stringify(newProf).replaceAll("'", "''"));

    console.log(`Replaced all single quotes with two single quotes`);

    if (!extIntegObj) newProf.integrators.external = [];

    const dskConfig = extIntegObj.filter((item) => {
        return item.name === featureName;
    });

    if (dskConfig && dskConfig.length > 0) {
        console.log(
            `${featureName} already exists, manually check if the URL needs to be updated...`
        );
    } else {
        console.log(`${featureName} adding feature-dsk configuration to external integrators in customer profile...
            ${JSON.stringify(dskEvent)}
        `);
        newProf.integrators.external.push(dskEvent);
        console.log(`PROFILE_DOCUMENT:'${JSON.stringify(newProf)}'`);
    }
}

async function teardown() {
    console.log("Removing feature-dsk event from cutstomer profile document");
    let data = readFileSync("./profile-doc.json");
    const integObj = JSON.parse(JSON.parse(data)).integrators || null;
    const extIntegObj = integObj.external || null;

    const newProf = JSON.parse(JSON.parse(data));

    if (!extIntegObj) newProf.integrators.external = [];

    const dskConfig = extIntegObj.filter((item) => {
        return item.name === featureName;
    });

    if (dskConfig && dskConfig.length > 0) {
        console.log(`${featureName} exists, removing from object...`);
        const dskRemoveConfig = extIntegObj.filter((item) => {
            return item.name !== featureName;
        });
        newProf.integrators.external = dskRemoveConfig;

        console.log(`PROFILE_DOCUMENT:'${JSON.stringify(newProf)}'`);
    } else {
        console.log(
            `${featureName} does not exist in external integrators in customer profile...skipping...`
        );
    }
}

(async () => {
    await perform();
})();
