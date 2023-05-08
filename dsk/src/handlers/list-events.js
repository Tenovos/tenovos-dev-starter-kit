const fs = require('fs');
const csv = require('fast-csv');
const configDescs = require('../../config/all-event-configs-desc.json');
const data = []

function readCsv(path) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path)
            .pipe(csv.parse({ headers: true }))
            .on('error', error => console.error(error))
            .on('data', row => data.push(row))
            .on('end', () => {
                resolve(data);
            });
    })
}
exports.handler = async (event, context) => {
    console.log(`Event is of type ${typeof event}`);
    console.log(JSON.stringify(event));
    let responseHtml = "<html><body><table>"
    try {
        const configArr = await readCsv('./config/all-event-configs.csv');
        for (let i = 0; i < data.length; i++) {
            //                    console.log(data[i]);
            //                    console.log(i);
            const line = data[i];
            const configs = JSON.parse(line.configurations);
            for (let j = 0; j < configs.length; j++) {
                const config = configs[j];
                const { service, module, criteria } = config;
                const action = criteria.action;
                let desc = "";
                for (let k = 0; k < configDescs.eventDescriptions.length; k++) {
                    const descObj = configDescs.eventDescriptions[k];
                    const doService = descObj.service;
                    const doModule = descObj.module;
                    const doAction = descObj.action;

                    if (doService === service && doModule === module && doAction === action) {
                        desc = descObj.description;
                    }
                }
                if (service !== "redshiftSync")
                    responseHtml += `<tr><td>${service}</td><td>${module}</td><td>${action}</td></tr>`;
            }
        }
    } catch (e) {
        console.log(e);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "error processing" }),
            headers: { "content-type": "application/json" },
        };
    }
    responseHtml += "</table></body></html>"
    console.log(responseHtml);
    return {
        statusCode: 200,
        body: responseHtml,
        headers: { "content-type": "text/html" }
    }
};
