const config = require("../config/storage.config");

const providers = require("../constants/providers.constant");

const S3CompatibleProvider = require("../providers/s3-compatible.provider");

const LocalProvider = require("../providers/local.provider");

const StorageService = require("../services/storage.service");

class StorageFactory {
  static create() {
    let provider;

    switch (config.provider) {
      case providers.S3_COMPATIBLE:
        provider = new S3CompatibleProvider();
        break;

      case providers.LOCAL:
        provider = new LocalProvider();
        break;

      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }

    return new StorageService(provider);
  }
}

module.exports = StorageFactory;
