class StorageService {
  constructor(provider) {
    this.provider = provider;
  }

  async upload(data) {
    return this.provider.upload(data);
  }

  async download(key) {
    return this.provider.download(key);
  }

  async delete(key) {
    return this.provider.delete(key);
  }

  async exists(key) {
    return this.provider.exists(key);
  }

  async list(prefix) {
    return this.provider.list(prefix);
  }

  async copy(source, destination) {
    return this.provider.copy(source, destination);
  }

  async move(source, destination) {
    return this.provider.move(source, destination);
  }

  async getUploadSignedUrl(data) {
    return this.provider.getUploadSignedUrl(data);
  }

  async getDownloadSignedUrl(key, expiresIn) {
    return this.provider.getDownloadSignedUrl(key, expiresIn);
  }
}

module.exports = StorageService;
