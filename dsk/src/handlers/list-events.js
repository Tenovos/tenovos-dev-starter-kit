const fs = require('fs');
const csv = require('fast-csv');
const data = []

exports.handler = async (event, context) => {
    console.log(`Event is of type ${typeof event}`);
    console.log(JSON.stringify(event));

    try {

        fs.createReadStream('../../config/all-event-configs.csv')
            .pipe(csv.parse({ headers: true }))
            .on('error', error => console.error(error))
            .on('data', row => data.push(row))
            .on('end', () => console.log(data));


    } catch (e) {
        console.log(e);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "error processing" }),
            headers: { "content-type": "application/json" },
        };
    }
};
