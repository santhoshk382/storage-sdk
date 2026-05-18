class UploadValidator {
  static validate({ key, body }) {
    if (!key) {
      throw new Error("key is required");
    }

    if (!body) {
      throw new Error("body is required");
    }
  }
}

module.exports = UploadValidator;
