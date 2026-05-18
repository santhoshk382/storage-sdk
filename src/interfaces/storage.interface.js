class StorageInterface {
  async upload() {
    throw new Error("upload() not implemented");
  }

  async download() {
    throw new Error("download() not implemented");
  }

  async delete() {
    throw new Error("delete() not implemented");
  }

  async exists() {
    throw new Error("exists() not implemented");
  }

  async list() {
    throw new Error("list() not implemented");
  }

  async copy() {
    throw new Error("copy() not implemented");
  }

  async move() {
    throw new Error("move() not implemented");
  }

  async getUploadSignedUrl() {
    throw new Error("getUploadSignedUrl() not implemented");
  }

  async getDownloadSignedUrl() {
    throw new Error("getDownloadSignedUrl() not implemented");
  }
}

module.exports = StorageInterface;
