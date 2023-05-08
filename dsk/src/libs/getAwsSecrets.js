// eslint-disable-next-line import/no-extraneous-dependencies
const awsSdk = require('aws-sdk');

module.exports = class SecretsManager {
  static getSecretManager(region) {
    const regionParsed = region || 'us-east-1';
    if (!this[regionParsed]) {
      this[regionParsed] = new awsSdk.SecretsManager({
        region: regionParsed,
      });
    }

    return this[regionParsed];
  }

  static async getSecret(key, region) {
    try {
      const secretManagerService = this.getSecretManager(region);
      const { SecretString, SecretBinary } = await secretManagerService
        .getSecretValue({
          SecretId: key,
        })
        .promise();
      if (SecretString) {
        return SecretString;
      }
      return Buffer.from(SecretBinary, 'base64').toString('utf-8');
    } catch (error) {
      const loggerData = {
        functionName: 'getSecret',
        error,
      };
      console.log('FUNCTION_ERROR', loggerData);
      throw error;
    }
  }
};
