const fs = require("fs");

const path = require("path");

class LocalProvider {
  constructor() {
    this.basePath = "./storage";
  }

  async upload({ key, body }) {
    const filePath = path.join(this.basePath, key);

    await fs.promises.mkdir(path.dirname(filePath), {
      recursive: true,
    });

    const writeStream = fs.createWriteStream(filePath);

    body.pipe(writeStream);

    return new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);

      writeStream.on("error", reject);
    });
  }
}

module.exports = LocalProvider;
