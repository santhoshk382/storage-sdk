require("dotenv").config();

module.exports = {
  provider: process.env.STORAGE_PROVIDER,

  s3: {
    endpoint: process.env.S3_ENDPOINT,

    region: process.env.S3_REGION || "us-east-1",

    accessKey: process.env.S3_ACCESS_KEY,

    secretKey: process.env.S3_SECRET_KEY,

    sessionToken: process.env.AWS_SESSION_TOKEN,

    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",

    bucket: process.env.S3_BUCKET,
  },
};
