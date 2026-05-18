const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  CopyObjectCommand,
} = require("@aws-sdk/client-s3");

const { Upload } = require("@aws-sdk/lib-storage");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const config = require("../config/storage.config");

const retry = require("../utils/retry.util");

const UploadValidator = require("../validators/upload.validator");

class S3CompatibleProvider {
  constructor() {
    this.bucket = config.s3.bucket;

    const clientConfig = {
      region: config.s3.region,

      forcePathStyle: config.s3.forcePathStyle,
    };

    /*
     * Optional endpoint
     * Needed for MinIO/custom providers
     */
    if (config.s3.endpoint) {
      clientConfig.endpoint = config.s3.endpoint;
    }

    /*
     * Optional credentials
     *
     * If not provided:
     * AWS SDK automatically uses IAM roles
     */
    if (config.s3.accessKey) {
      clientConfig.credentials = {
        accessKeyId: config.s3.accessKey,

        secretAccessKey: config.s3.secretKey,
      };

      /*
       * Optional STS token
       */
      if (config.s3.sessionToken) {
        clientConfig.credentials.sessionToken = config.s3.sessionToken;
      }
    }

    this.client = new S3Client(clientConfig);
  }

  async upload({ key, body, contentType, metadata = {} }) {
    UploadValidator.validate({
      key,
      body,
    });

    return retry(async () => {
      const upload = new Upload({
        client: this.client,

        params: {
          Bucket: this.bucket,

          Key: key,

          Body: body,

          ContentType: contentType,

          Metadata: metadata,
        },

        queueSize: 4,

        partSize: 10 * 1024 * 1024,
      });

      return upload.done();
    });
  }

  async download(key) {
    return retry(async () => {
      return this.client.send(
        new GetObjectCommand({
          Bucket: this.bucket,

          Key: key,
        }),
      );
    });
  }

  async delete(key) {
    return retry(async () => {
      return this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,

          Key: key,
        }),
      );
    });
  }

  async exists(key) {
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,

          Key: key,
        }),
      );

      return true;
    } catch {
      return false;
    }
  }

  async list(prefix = "") {
    return retry(async () => {
      return this.client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,

          Prefix: prefix,
        }),
      );
    });
  }

  async copy(sourceKey, destinationKey) {
    return retry(async () => {
      return this.client.send(
        new CopyObjectCommand({
          Bucket: this.bucket,

          CopySource: `${this.bucket}/${sourceKey}`,

          Key: destinationKey,
        }),
      );
    });
  }

  async move(sourceKey, destinationKey) {
    await this.copy(sourceKey, destinationKey);

    await this.delete(sourceKey);
  }

  async getUploadSignedUrl({ key, contentType, expiresIn = 3600 }) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,

      Key: key,

      ContentType: contentType,
    });

    return getSignedUrl(this.client, command, {
      expiresIn,
    });
  }

  async getDownloadSignedUrl(key, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,

      Key: key,
    });

    return getSignedUrl(this.client, command, {
      expiresIn,
    });
  }
}

module.exports = S3CompatibleProvider;
