require("dotenv").config();

const fs = require("fs");

const path = require("path");

const storage = require("../src");

async function main() {
  const filePath = path.join(__dirname, "sample.pdf");

  await storage.upload({
    key: "documents/test.pdf",

    body: fs.createReadStream(filePath),

    contentType: "application/pdf",

    metadata: {
      uploadedBy: "santhosh",
    },
  });

  console.log("File uploaded successfully");
}

main().catch((err) => {
  console.error("Upload failed:", err);
});
