require("dotenv").config({ path: __dirname + "/../.env" });
const fs = require("fs");
const appAuth = require("./libs/auth.js");
const tools = require("./tools/utilities");
const path = require("path");
const AWS = require("aws-sdk");
const auth = require("@adobe/jwt-auth");
const moment = require("moment");
const _ = require("underscore");
const fetch = require("node-fetch");
const config = require("../config/config.json");

async function someBusinessLogic(assetId) {
  console.log("I have been executed...sort of...")
}

exports.someBusinessLogic = someBusinessLogic;
