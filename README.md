# Tenovos Dev Starter Kit

## Overview
A set of tools to quickly deploy an integration to the Tenovos platform. This is generic in nature, and requires the developer to write the business logic (or use Chat GPT :) )

### ILS
1. Create a collection of INDD documents that need to be fixed
2. Execute the Fix INDDs action on the collection
3. Wait for manifest-tsv.json to show up in S3, s3://dsk-config1653371372758ppilsprod678394015028-us-east-1/to-be-processed/${actionId}/${collectionId}/
4. Once the manifest-tsv.json file is available, download that file
5. Copy the contents of the "csv" (which is tab delimited with \t, not comma delimited due to potential for commas in filenames) out of the file and into excel or google sheets such that the csv/tsv contents are in individual cells.
6. At this point a person may need to visually identify the right links when there are multiple candidates for linking
7. Export the final link contents after review, to a CSV file
8. Invoke the indesign linking command line tool with the CSV (See notes below on how to run)

### InDesign Relationship Linking
Uses `SECONDARY OBJECT ID`'s `filename` to find the row from InDesign layout links to update InDesign master object metadata.
If row is not found relationship will not be created.

#### Installation
Requires [Node.js](https://nodejs.org/) v16+ to run.
Install the dependencies.
```sh
cd /tenovos-cicd/indesign-linking
npm ci
```
#### Config
Modify `config.json` file. Requires AWS profile setup.
```sh
{
    "awsProfile": "ninja7",
    "customerId": "xxxxxxx",
    "apiBaseUrl": "https://api-url/content-store-v1",
    "apiKey": "API Gateway API Key",
    "clientId": "Cognito user pool app client ID",
    "username": "Tenovos username",
    "password": "Tenovos password",
    "concurrentTasks": 6
}
```
#### CSV FILE Format
```sh
PRIMARY OBJECT ID,SECONDARY OBJECT ID
47f51179-c7d7-4f40-b0b2-4d42d7aa56ca,e2ed7fe7-d78d-4490-8200-795a77dcf36f
```
#### Execution
```sh
node index.js ./sheet.csv
```
