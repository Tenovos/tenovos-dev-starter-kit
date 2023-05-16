/* eslint-disable indent */
const Utilities = require('../tools/utilities');

/* eslint-disable indent */
const handler = async (event, context) => {
    console.info(`ENTER_SERVICE: \n${JSON.stringify(event)}`);

    const record = event.Records[0];
    const body = JSON.parse(record.body);
    const bodyRecords = body.Records;
    const actionCsv = [];
    for (let i = 0; i < bodyRecords.length; i += 1) {
        const element = bodyRecords[i];
        const bucket = element.s3.bucket.name;
        const { key } = element.s3.object;
        // eslint-disable-next-line no-await-in-loop
        const obj = await Utilities.s3GetKey(bucket, key);
        console.log(`csv: ${obj}`);
        // const { actionId, collectionId, objectIds } = JSON.parse(obj.Body);
        // const prefix = 'to-be-processed';

        // //        console.log(`${objectIds}`);
        // for (let j = 0; j < objectIds.length; j += 1) {
        //     const object = objectIds[j];
        //     const assetEntryKey = `${prefix}/${actionId}/${collectionId}/${object}.json`;
        //     try {
        //         // eslint-disable-next-line no-await-in-loop
        //         const assetEntry = await Utilities.s3GetKey(bucket, assetEntryKey);
        //         console.log(typeof assetEntry.Body);
        //         console.log(assetEntry.Body.toString());
        //         const partialCsv = JSON.parse(assetEntry.Body.toString()).csv;
        //         actionCsv.push(...partialCsv);
        //     } catch (error) {
        //         console.error(`failed to get key ${assetEntryKey}`);
        //     }
        // }
        // await Utilities.s3PutObject(bucket, `${prefix}/${actionId}/${collectionId}/manifest-tsv.json`, {
        //     tsv: actionCsv,
        // });
    }
    console.log(actionCsv);

    return context.succeed();
};

module.exports = {
    handler,
};
